<?php

/**
 * src/scripts/personContributesProduct.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

use Doctrine\ORM\EntityManager;
use TDW\ACiencia\Entity\Person;
use TDW\ACiencia\Entity\Product;
use TDW\ACiencia\Utility\DoctrineConnector;

require __DIR__ . '/inicio.php';

if (3 !== $argc) {
    $fich = basename(__FILE__);
    echo <<< MARCA_FIN

Usage: $fich <personId> <productId>
 
MARCA_FIN;
    exit(0);
}

$personId = (int) $argv[1];
$productId = (int) $argv[2];

try {
    /** @var EntityManager $entityManager */
    $entityManager = DoctrineConnector::getEntityManager();
    /** @var Person|null $person */
    $person = $entityManager->find(Person::class, $personId);
    if (!$person instanceof Person) {
        throw new Exception("Person $personId not exist" . PHP_EOL);
    }
    /** @var Product|null $product */
    $product = $entityManager->find(Product::class, $productId);
    if (!$product instanceof Product) {
        throw new Exception("Product $productId not exist" . PHP_EOL);
    }

    $person->addProduct($product);
    $entityManager->flush();
    $entityManager->close();
    echo 'Person ID=' . $person->getId() . ': added product ' . $productId . PHP_EOL;
} catch (Throwable $e) {
    exit('ERROR (' . $e->getCode() . '): ' . $e->getMessage());
}
