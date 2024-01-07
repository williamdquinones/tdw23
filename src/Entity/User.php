<?php

/**
 * src/Entity/User.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

namespace TDW\ACiencia\Entity;

use Cake\Chronos\Date;
use Doctrine\ORM\Mapping as ORM;
use InvalidArgumentException;
use JetBrains\PhpStorm\ArrayShape;
use JsonSerializable;
use Stringable;
use ValueError;
use DateTime;

#[ORM\Entity, ORM\Table(name: "user")]
#[ORM\UniqueConstraint(name: "IDX_UNIQ_USERNAME", columns: [ "username" ])]
#[ORM\UniqueConstraint(name: "IDX_UNIQ_EMAIL", columns: [ "email" ])]
class User implements JsonSerializable, Stringable
{
    #[ORM\Column(
        name: "id",
        type: "integer",
        nullable: false
    )]
    #[ORM\Id(), ORM\GeneratedValue(strategy: "IDENTITY")]
    protected int $id;

    #[ORM\Column(
        name: "username",
        type: "string",
        length: 32,
        unique: true,
        nullable: false
    )]
    protected string $username;

    #[ORM\Column(
        name: "name",
        type: "string",
        length: 32,
        nullable: false
    )]
    protected string $name;

    #[ORM\Column(
        name: "birthdate",
        type: "datetime",
        nullable: true
    )]
    protected DateTime | null $birthDate = null;

    #[ORM\Column(
        name: "email",
        type: "string",
        length: 60,
        unique: true,
        nullable: false
    )]
    protected string $email;

    #[ORM\Column(
        name: "user_url",
        type: "string",
        length: 2047,
        nullable: true
    )]
    protected string | null $userUrl = null;

    #[ORM\Column(
        name: "password",
        type: "string",
        length: 60,
        nullable: false
    )]
    protected string $password_hash;

    #[ORM\Column(
        name: "role",
        type: "string",
        length: 10,
        nullable: false,
        enumType: Role::class
    )]
    protected Role $role;

    #[ORM\Column(
        name: "status",
        type: "string",
        length: 10,
        nullable: false,
        enumType: Status::class
    )]
    protected Status $status;

    /**
     * User constructor.
     *
     * @param string $username username
     * @param string $name name
     * @param DateTime $birthDate birthDate
     * @param string $email email
     * @param string $userUrl userUrl
     * @param string $password password
     * @param Role|string $role Role::*
     * @param Status|string $status Status::*
     *
     */
    public function __construct(
        string $username,
        string $name,
        DateTime $birthDate,
        string $email,
        string $userUrl,
        string $password,
        Role|string $role,
        Status|string $status
    ) {
        $this->id = 0;
        $this->username = $username;
        $this->name = $name;
        $this->birthDate = $birthDate;
        $this->email = $email;
        $this->userUrl = $userUrl;
        $this->password_hash = $this->encrypted($password);
        $this->setRole($role);
        $this->setStatus($status);
    }

    /**
     * @return int User id
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * Get username
     *
     * @return string
     */
    public function getUsername(): string
    {
        return $this->username;
    }

    /**
     * Set username
     *
     * @param string $username username
     * @return void
     */
    public function setUsername(string $username): void
    {
        $this->username = $username;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getBirthDate(): DateTime
    {
        return $this->birthDate;
    }

    public function setBirthDate(DateTime $birthDate): void
    {
        $this->birthDate = $birthDate;
    }

    /**
     * Get user e-mail
     *
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * Set user e-mail
     *
     * @param string $email email
     * @return void
     */
    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    public function getUserUrl(): string
    {
        return $this->userUrl;
    }

    public function setUserUrl(string $userUrl): void
    {
        $this->userUrl = $userUrl;
    }

    /**
     * @param Role|string $role
     * @return bool
     */
    public function hasRole(Role|string $role): bool
    {
        if (!$role instanceof Role) {
            $role = Role::from($role);
        }
        return match ($role) {
            Role::READER => true,
            Role::WRITER => ($this->role === Role::WRITER),
            default => false
        };
    }

    /**
     * @param Role|string $newRole [ Role::READER | Role::WRITER | 'reader' | 'writer' ]
     * @return void
     * @throws InvalidArgumentException
     */
    public function setRole(Role|string $newRole): void
    {
        try {
            $this->role = ($newRole instanceof Role)
                ? $newRole
                : Role::from(strtolower($newRole));
        } catch (ValueError) {
            throw new InvalidArgumentException('Invalid Role');
        }
    }

    /**
     * @return Role[] [ READER ] | [ READER , WRITER ]
     */
    public function getRoles(): array
    {
        $roles = array_filter(
            Role::cases(),
            fn($myRole) => $this->hasRole($myRole)
        );

        return $roles;
    }

    public function isInactive(): bool
    {
        return ($this->status === Status::INACTIVE);
    }

    public function setStatus(Status|string $newStatus): void
    {
        try {
            $this->status = ($newStatus instanceof Status)
                ? $newStatus
                : Status::from(strtolower($newStatus));
        } catch (ValueError) {
            throw new InvalidArgumentException('Invalid status');
        }
    }


    /**
     * Get the hashed password
     *
     * @return string
     */
    public function getPassword(): string
    {
        return $this->password_hash;
    }

    /**
     * @param string $password password
     * @return void
     */
    public function setPassword(string $password): void
    {
        //$this->password_hash = strval(password_hash($password, PASSWORD_DEFAULT));
        $this->password_hash = $this->encrypted($password);
    }

    /**
     * Verifies that the given hash matches the user password.
     *
     * @param string $password password
     * @return boolean
     */
    public function validatePassword(string $password): bool
    {
        return ($this->password_hash == $this->encrypted($password));
    }

    public function __toString(): string
    {
        return
            sprintf(
                '[%s: (id=%04d, username="%s", name="%s", birthDate="%s", email="%s", userUrl="%s", role="%s", status="%s")]',
                basename(self::class),
                $this->getId(),
                $this->getUsername(),
                $this->getName(),
                $this->getBirthDate()?->format('Y-m-d'),
                $this->getEmail(),
                $this->getUserUrl(),
                $this->role->name,
                $this->status->name,
            );
    }

    public function encrypted(string $password):string{
        $cipher_algo = "AES-256-CBC"; //16bytes
        $secret = "FinalTDW23";
        $iv = str_repeat('1', openssl_cipher_iv_length($cipher_algo)); //int=16

        return openssl_encrypt($password, $cipher_algo, $secret, 0, $iv);
    }
    public function decrypted(string $encrypted):string{
        $cipher_algo = "AES-256-CBC"; //16bytes
        $secret = "FinalTDW23";
        $iv = str_repeat('1', openssl_cipher_iv_length($cipher_algo)); //int=16

        return openssl_decrypt($encrypted, $cipher_algo, $secret, 0, $iv);
    }

    /**
     * @see JsonSerializable
     */
    #[ArrayShape(['user' => "array"])]
    public function jsonSerialize(): mixed
    {
        return [
            'user' => [
                'id' => $this->getId(),
                'username' => $this->getUsername(),
                'name' => $this->getName(),
                'birthDate' => $this->getBirthDate()?->format('Y-m-d'),
                'email' => $this->getEmail(),
                'userUrl' => $this->getUserUrl(),
                'password' => $this->decrypted($this->password_hash),
                'role' => $this->role->name,
                'status' => $this->status->name
            ]
        ];
    }
}
