<?php

/**
 * src/Controller/User/OptionsQuery.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

namespace TDW\ACiencia\Controller\User;

use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Http\Response;
use Slim\Routing\RouteContext;

class OptionsQuery
{
    /**
     * Summary: Provides the list of HTTP supported methods
     *
     * @param Request $request
     * @param Response $response
     *
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        $routeContext = RouteContext::fromRequest($request);
        $routingResults = $routeContext->getRoutingResults();
        $methods = $routingResults->getAllowedMethods();

        return $response
            ->withStatus(204)
            ->withAddedHeader('Cache-Control', 'private')
            ->withAddedHeader(
                'Allow',
                implode(',', $methods)
            );
    }
}
