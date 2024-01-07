<?php

/**
 * src/scripts/newUser.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

require __DIR__ . '/inicio.php';

use Doctrine\ORM\EntityManager;
use TDW\ACiencia\Entity\Role;
use TDW\ACiencia\Entity\Status;
use TDW\ACiencia\Entity\User;
use TDW\ACiencia\Utility\DoctrineConnector;

try {
    $username = 'adminUser';
    $name = 'adminUser';
    $birthDate = new DateTime();
    $role = Role::WRITER;
    $status = Status::ACTIVE;

    /** @var EntityManager $entityManager */
    $entityManager = DoctrineConnector::getEntityManager();
    $user = new User($username, $name, $birthDate, $name . '@example.com', 'www.' . $name . '.example.es' , $username, $role, $status);

    $entityManager->persist($user);
    $entityManager->flush();
    echo 'Created User with ID ' . $user->getId() . PHP_EOL;
} catch (Throwable $e) {
    exit('ERROR (' . $e->getCode() . '): ' . $e->getMessage());
}
