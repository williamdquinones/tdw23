<?php

/**
 * src/Utility/Error.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

namespace TDW\ACiencia\Utility;

use Slim\Http\Response;
use Fig\Http\Message\StatusCodeInterface as StatusCode;

/**
 * Class Error
 */
final class Error
{
    // Error messages
    public const MESSAGES = [
        StatusCode::STATUS_BAD_REQUEST            // 400
            => 'BAD REQUEST: name or e-mail already exists, or role does not exist',
        StatusCode::STATUS_UNAUTHORIZED           // 401
            => 'UNAUTHORIZED: invalid Authorization header',
        StatusCode::STATUS_FORBIDDEN              // 403
            => 'FORBIDDEN You don\'t have permission to access',
        StatusCode::STATUS_NOT_FOUND              // 404
            => 'NOT FOUND: Resource not found',
        StatusCode::STATUS_NOT_ACCEPTABLE         // 406
            => 'NOT ACCEPTABLE: Requested resource not found',
        StatusCode::STATUS_CONFLICT               // 409
            => 'CONFLICT: Role out of range',
        StatusCode::STATUS_PRECONDITION_FAILED    // 412
            => 'PRECONDITION FAILED: one or more conditions given evaluated to false',
        StatusCode::STATUS_UNPROCESSABLE_ENTITY   // 422
            => 'UNPROCESSABLE ENTITY: name, e-mail or password is left out',
        StatusCode::STATUS_METHOD_NOT_ALLOWED     // 405
            => 'METHOD NOT ALLOWED',
        StatusCode::STATUS_NOT_IMPLEMENTED        // 501
            => 'METHOD NOT IMPLEMENTED',
    ];

    /**
     * @param Response $response Original Response
     * @param int $statusCode Response Status code
     * @param array<string,string>|null $error OAuth2 error parameters
     *
     * @return Response Error response
     */
    public static function createResponse(
        Response $response,
        int $statusCode,
        array|null $error = null
    ): Response {
        $msgdata = $error ?? [ 'code' => $statusCode, 'message' => self::MESSAGES[$statusCode] ];

        return $response
            ->withJson($msgdata, $statusCode);
    }
}
