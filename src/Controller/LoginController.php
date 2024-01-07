<?php

/**
 * src/Controller/LoginController.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

namespace TDW\ACiencia\Controller;

use Doctrine\ORM;
use Fig\Http\Message\StatusCodeInterface as StatusCode;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Http\Response;
use TDW\ACiencia\Auth\JwtAuth;
use TDW\ACiencia\Entity\Role;
use TDW\ACiencia\Entity\User;
use TDW\ACiencia\Utility\Error;

/**
 * Class LoginController
 */
class LoginController
{
    // constructor: receives container instance
    public function __construct(
        protected ORM\EntityManager $entityManager,
        protected JwtAuth $jwtAuth
    ) {
    }

    /**
     * POST /access_token
     *
     * @param Request $request Representation of an incoming server-side HTTP request
     * @param Response $response Response interface
     *
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        assert($request->getMethod() === 'POST');
        $req_data = (array) $request->getParsedBody();

        $user = null;
        if (isset($req_data['username'], $req_data['password'])) {
            $user = $this->entityManager
                ->getRepository(User::class)
                ->findOneBy([ 'username' => $req_data['username'] ]);
        }

        if (!$user instanceof User || !$user->validatePassword($req_data['password'])) {    // 400
            return Error::createResponse(   // https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/
                $response,
                StatusCode::STATUS_BAD_REQUEST,
                [
                    'error' => 'invalid_grant',
                    'error_description' => 'The user’s password is invalid or expired',
                ]
            );
        }

        if ($user->isInactive()) {    // 403
            return Error::createResponse(   //
                $response,
                StatusCode::STATUS_FORBIDDEN,
                [
                    'error_description' => 'Your status is currently inactive'
                ]
            );
        }

        if (!array_key_exists('scope', $req_data)) {
            $token = $this->jwtAuth->createJwt($user);
        } else {
            $claimedScopes = preg_split(
                '/ |(\+)/',
                $req_data['scope'],
                -1,
                PREG_SPLIT_NO_EMPTY
            );
            $claimedScopes = empty($claimedScopes[0])
                ? Role::ALL_VALUES
                : $claimedScopes;
            $token = $this->jwtAuth->createJwt($user, $claimedScopes);
        }

        return $response
            ->withJson([
                'token_type' => 'Bearer',
                'expires_in' => $this->jwtAuth->getLifetime(),    // 14400
                'access_token' => $token->toString(),
            ])
            ->withHeader('Cache-Control', 'no-store')   // Ensure clients do not cache this request
            ->withHeader('Authorization', 'Bearer ' . $token->toString());
    }
}
