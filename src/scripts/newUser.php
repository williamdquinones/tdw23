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
    $num = random_int(0, 100000);
    $role = ($num % 2) ? Role::READER : Role::WRITER;
    $username = 'user-' . $num;
    $birthDate = new DateTime();
    $status = ($num % 2) ? Status::ACTIVE : Status::INACTIVE;
    $password = $username.'33!';
    /** @var EntityManager $entityManager */
    $entityManager = DoctrineConnector::getEntityManager();
    $user = new User($username, $username, $birthDate, $username . '@example.com', 'www.' . $username . '.example.es' , $password, $role, $status);

    $entityManager->persist($user);
    $entityManager->flush();
    echo 'Created User with ID ' . $user->getId() . PHP_EOL;
} catch (Throwable $e) {
    exit('ERROR (' . $e->getCode() . '): ' . $e->getMessage());
}
