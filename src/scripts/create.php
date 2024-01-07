<?php

/**
 * src/scripts/create.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

use Doctrine\ORM\EntityManager;
use TDW\ACiencia\Factory\ElementFactory;
use TDW\ACiencia\Factory\EntityFactory;
use TDW\ACiencia\Factory\PersonFactory;
use TDW\ACiencia\Factory\ProductFactory;
use TDW\ACiencia\Utility\DoctrineConnector;

require __DIR__ . '/inicio.php';

if (3 !== $argc) {
    $fich = basename(__FILE__);
    echo <<< MARCA_FIN

Usage: $fich [product | entity | person] <name>
 
MARCA_FIN;
    exit(0);
}

$ElementType = strtolower($argv[1]);
$name = $argv[2];

try {
    /** @var ElementFactory $factoryClass */
    $factoryClass = match ($ElementType) {
        'product' => ProductFactory::class,
        'entity' => EntityFactory::class,
        'person' => PersonFactory::class,
        default => throw new ErrorException('Second parameter Element must be [product | entity | person]'),
    };

    /** @var EntityManager $entityManager */
    $entityManager = DoctrineConnector::getEntityManager();
    $element = $factoryClass::createElement($name);
    $entity = $entityManager->getRepository($element::class)->findOneBy(['name' => $name]);
    if (null !== $entity) {
        throw new Exception("Element $name of type " . $element::class . " already exists" . PHP_EOL);
    }

    $entityManager->persist($element);
    $entityManager->flush();
    echo 'Created Element with ID ' . $element->getId() . PHP_EOL;

    $entityManager->close();
} catch (Throwable $e) {
    exit('ERROR (' . $e->getCode() . '): ' . $e->getMessage());
}
