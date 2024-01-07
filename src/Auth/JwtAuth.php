<?php

/**
 * src/Auth/JwtAuth.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

declare(strict_types=1);

namespace TDW\ACiencia\Auth;

use DateTimeImmutable;
use InvalidArgumentException;
use Lcobucci\JWT;
use Ramsey\Uuid\Uuid;
use TDW\ACiencia\Entity\Role;
use TDW\ACiencia\Entity\User;

/**
 * Class JwtAuth
 *
 * JSON Web Token (JWT) - https://www.rfc-editor.org/rfc/rfc7519
 */
final class JwtAuth
{
    /**
     * The constructor.
     *
     * @param JWT\Configuration $config
     * @param string $issuer
     * @param string $clientId OAuth2 client id.
     * @param int $lifetime The max lifetime
     */
    public function __construct(
        protected JWT\Configuration $config,
        protected string $issuer,
        protected string $clientId,
        protected int $lifetime
    ) {
    }

    /**
     * Get JWT max lifetime.
     *
     * @return int The lifetime in seconds
     */
    public function getLifetime(): int
    {
        return $this->lifetime;
    }

    /**
     * Create a JSON web token.
     *
     * @param User $user
     * @param array<string> $requestedScopes Requested scopes
     * @return JWT\Token\Plain The JWT
     */
    public function createJwt(User $user, array $requestedScopes = Role::ALL_VALUES): JWT\Token\Plain
    {
        $awardedScopes = array_filter(
            array_unique(array_merge($requestedScopes, [Role::READER->value])),
            fn($role) => $user->hasRole($role),
        );

        $now = new DateTimeImmutable();
        assert(!empty($this->issuer));
        assert(!empty($user->getUsername()));
        assert(!empty($this->clientId));

        $token = $this->config->builder()
            ->issuedBy($this->issuer)   // iss: Issuer (who created and signed this token)
            ->issuedAt($now)    // iat: The time at which the JWT was issued
            ->relatedTo($user->getUsername()) // sub: Subject (whom de token refers to)
            ->identifiedBy(Uuid::uuid4()->toString())   // jti: JWT id (unique identifier for this token)
            ->canOnlyBeUsedAfter($now)  // nbf: Not valid before
            ->expiresAt($now->modify('+' . $this->getLifetime() . ' seconds'))
            ->permittedFor($this->clientId) // Audience (who or what the token is intended for)
            ->withClaim('uid', $user->getId())
            ->withClaim('scopes', array_values($awardedScopes))
            ->getToken($this->config->signer(), $this->config->signingKey());

        return new JWT\Token\Plain(
            $token->headers(),
            $token->claims(),
            $token->signature()
        );
    }

    /**
     * Parse token.
     *
     * @param non-empty-string $token The JWT
     *
     * @return JWT\Token The parsed token
     */
    public function createParsedToken(string $token): JWT\Token
    {
        assert(!empty($token));
        return $this->config->parser()->parse($token);
    }

    /**
     * Validate the access token.
     *
     * @param non-empty-string $accessToken The JWT
     * @throws InvalidArgumentException
     * @return true The status
     */
    public function validateToken(string $accessToken): bool
    {
        assert($this->config instanceof JWT\Configuration);
        assert(!empty($accessToken));

        $token = $this->config->parser()->parse($accessToken);
        assert($token instanceof JWT\Token);

        if (! $this->config->validator()->validate($token, ...$this->config->validationConstraints())) {
            throw new InvalidArgumentException('Invalid token provided');
        }

        return true;
    }
}
