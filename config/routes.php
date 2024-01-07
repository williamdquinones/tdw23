<?php

/**
 * config/routes.php - Define app routes
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

use TDW\ACiencia\Controller\LoginController;
use Slim\App;

return function (App $app) {

    // Redirection / -> /api-docs/index.html
    $app->redirect(
        '/',
        '/api-docs/index.html'
    )->setName('tdw_home_redirect');

    /**
     * ############################################################
     * routes /access_token
     * POST /access_token
     * ############################################################
     */
    $app->post(
        $_ENV['RUTA_LOGIN'],
        LoginController::class
    )->setName('tdw_post_login');
};
