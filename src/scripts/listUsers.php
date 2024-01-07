<?php

/**
 * src/scripts/listUsers.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

require __DIR__ . '/inicio.php';

use Doctrine\ORM\EntityManager;
use TDW\ACiencia\Entity\User;
use TDW\ACiencia\Utility\DoctrineConnector;

try {
    /** @var EntityManager $entityManager */
    $entityManager = DoctrineConnector::getEntityManager();
    $users = $entityManager->getRepository(User::class)->findAll();
    $entityManager->close();
} catch (Throwable $e) {
    exit('ERROR (' . $e->getCode() . '): ' . $e->getMessage());
}

// Salida formato JSON
if (in_array('--json', $argv)) {
    echo json_encode(
        ['users' => $users],
        JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR
    );
} else {
    foreach ($users as $user) {
        echo $user . PHP_EOL;
    }
    echo sprintf("\nTotal: %d users.\n\n", count($users));
}
