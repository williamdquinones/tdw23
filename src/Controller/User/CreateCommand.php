<?php

/**
 * src/Controller/User/CreateCommand.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

namespace TDW\ACiencia\Controller\User;

use Cake\Chronos\Date;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM;
use Fig\Http\Message\StatusCodeInterface as StatusCode;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Http\Response;
use TDW\ACiencia\Controller\TraitController;
use TDW\ACiencia\Entity\User;
use TDW\ACiencia\Utility\Error;
use Throwable;
use DateTime;

class CreateCommand
{
    use TraitController;

    public function __construct(protected ORM\EntityManager $entityManager)
    {
    }

    /**
     * Summary: Creates a new user
     *
     * @param Request $request
     * @param Response $response
     *
     * @return Response
     * @throws ORM\ORMException
     */
    public function __invoke(Request $request, Response $response): Response
    {
        if (!$this->checkWriterScope($request)) { // 403
            return Error::createResponse($response, StatusCode::STATUS_FORBIDDEN);
        }

        $req_data = $request->getParsedBody() ?? [];

        if (!isset($req_data['username'],  $req_data['name'], $req_data['email'], $req_data['password'])) { // 422 - Faltan datos
            return Error::createResponse($response, StatusCode::STATUS_UNPROCESSABLE_ENTITY);
        }

        // hay datos -> procesarlos
        $criteria = new Criteria();
        $criteria
            ->where($criteria::expr()->eq('username', $req_data['username']))
            ->orWhere($criteria::expr()->eq('email', $req_data['email']));
        // STATUS_BAD_REQUEST 400: username or e-mail already exists
        if ($this->entityManager->getRepository(User::class)->matching($criteria)->count()) {
            return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
        }

        // 201
        try {
            $user = new User(
                $req_data['username'],
				$req_data['name'],
                DateTime::createFromFormat('!Y-m-d', $req_data['birthDate']),
                $req_data['email'],
				$req_data['userUrl'],
                $req_data['password'],
                $req_data['role'],
                $req_data['status']
            );

        } catch (Throwable) {    // 400 BAD REQUEST: Unexpected role
            return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
        }
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $response
            ->withAddedHeader(
                'Location',
                $request->getUri() . '/' . $user->getId()
            )
            ->withJson($user, StatusCode::STATUS_CREATED);
    }
}
