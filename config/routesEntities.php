<?php

/**
 * config/routesEntities.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

use Slim\App;
use TDW\ACiencia\Controller\Entity\EntityCommandController;
use TDW\ACiencia\Controller\Entity\EntityQueryController;
use TDW\ACiencia\Controller\Entity\EntityRelationsController;
use TDW\ACiencia\Middleware\JwtMiddleware;

/**
 * ############################################################
 * routes /api/v1/entities
 * ############################################################
 * @param App $app
 */
return function (App $app) {

    $REGEX_ENTITY_ID = '/{entityId:[0-9]+}';
    $REGEX_ELEMENT_ID = '/{elementId:[0-9]+}';
    $REGEX_ENTITY_NAME = '[a-zA-Z0-9()áéíóúÁÉÍÓÚñÑ %$\.+-]+';

    // CGET: Returns all entities
    $app->get(
        $_ENV['RUTA_API'] . EntityQueryController::PATH_ENTITIES,
        EntityQueryController::class . ':cget'
    )->setName('readEntities');
    //    ->add(JwtMiddleware::class);

    // GET: Returns a entity based on a single ID
    $app->get(
        $_ENV['RUTA_API'] . EntityQueryController::PATH_ENTITIES . $REGEX_ENTITY_ID,
        EntityQueryController::class . ':get'
    )->setName('readEntity');
    //    ->add(JwtMiddleware::class);

    // GET: Returns status code 204 if entityname exists
    $app->get(
        $_ENV['RUTA_API'] . EntityQueryController::PATH_ENTITIES . '/entityname/{entityname:' . $REGEX_ENTITY_NAME . '}',
        EntityQueryController::class . ':getEntityname'
    )->setName('existsEntity');

    // DELETE: Deletes a entity
    $app->delete(
        $_ENV['RUTA_API'] . EntityCommandController::PATH_ENTITIES . $REGEX_ENTITY_ID,
        EntityCommandController::class . ':delete'
    )->setName('deleteEntity')
        ->add(JwtMiddleware::class);

    // OPTIONS: Provides the list of HTTP supported methods
    $app->options(
        $_ENV['RUTA_API'] . EntityQueryController::PATH_ENTITIES . '[' . $REGEX_ENTITY_ID . ']',
        EntityQueryController::class . ':options'
    )->setName('optionsEntity');

    // POST: Creates a new entity
    $app->post(
        $_ENV['RUTA_API'] . EntityCommandController::PATH_ENTITIES,
        EntityCommandController::class . ':post'
    )->setName('createEntity')
        ->add(JwtMiddleware::class);

    // PUT: Updates a entity
    $app->put(
        $_ENV['RUTA_API'] . EntityCommandController::PATH_ENTITIES . $REGEX_ENTITY_ID,
        EntityCommandController::class . ':put'
    )->setName('updateEntity')
        ->add(JwtMiddleware::class);

    // RELATIONSHIPS

    // GET /entities/{entityId}/persons
    $app->get(
        $_ENV['RUTA_API'] . EntityQueryController::PATH_ENTITIES . $REGEX_ENTITY_ID . '/persons',
        EntityRelationsController::class . ':getPersons'
    )->setName('readEntityPersons');
    //    ->add(JwtMiddleware::class);

    // PUT /entities/{entityId}/persons/add/{elementId}
    $app->put(
        $_ENV['RUTA_API'] . EntityCommandController::PATH_ENTITIES . $REGEX_ENTITY_ID . '/persons/add' . $REGEX_ELEMENT_ID,
        EntityRelationsController::class . ':operationPerson'
    )->setName('tdw_entities_add_person')
        ->add(JwtMiddleware::class);

    // PUT /entities/{entityId}/persons/rem/{elementId}
    $app->put(
        $_ENV['RUTA_API'] . EntityCommandController::PATH_ENTITIES . $REGEX_ENTITY_ID . '/persons/rem' . $REGEX_ELEMENT_ID,
        EntityRelationsController::class . ':operationPerson'
    )->setName('tdw_entities_rem_person')
        ->add(JwtMiddleware::class);

    // GET /entities/{entityId}/products
    $app->get(
        $_ENV['RUTA_API'] . EntityQueryController::PATH_ENTITIES . $REGEX_ENTITY_ID . '/products',
        EntityRelationsController::class . ':getProducts'
    )->setName('readEntityProducts');
    //    ->add(JwtMiddleware::class);

    // PUT /entities/{entityId}/products/add/{elementId}
    $app->put(
        $_ENV['RUTA_API'] . EntityCommandController::PATH_ENTITIES . $REGEX_ENTITY_ID
            . '/products/add' . $REGEX_ELEMENT_ID,
        EntityRelationsController::class . ':operationProduct'
    )->setName('tdw_entities_add_product')
        ->add(JwtMiddleware::class);

    // PUT /entities/{entityId}/products/rem/{elementId}
    $app->put(
        $_ENV['RUTA_API'] . EntityCommandController::PATH_ENTITIES . $REGEX_ENTITY_ID
        . '/products/rem' . $REGEX_ELEMENT_ID,
        EntityRelationsController::class . ':operationProduct'
    )->setName('tdw_entities_rem_product')
        ->add(JwtMiddleware::class);
};
