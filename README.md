![logo UPM](https://raw.githubusercontent.com/laracabrera/AOS/master/tarea1/logo_upm.jpg)  TDW: REST API - Anales de la Ciencia
======================================

[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Minimum PHP Version](https://img.shields.io/badge/php-%5E8.2-blue.svg)](http://php.net/)
[![Build Status](https://scrutinizer-ci.com/g/FJavierGil/ACiencia/badges/build.png?b=master&s=f78545ddddef6aed3696ab7470c1d48421cee9d1)](https://scrutinizer-ci.com/g/FJavierGil/ACiencia/build-status/master)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/FJavierGil/ACiencia/badges/quality-score.png?b=master&s=ced26a14a5730e2f1b084a9b32db4472b672b60b)](https://scrutinizer-ci.com/g/FJavierGil/ACiencia/?branch=master)
[![Code Coverage](https://scrutinizer-ci.com/g/FJavierGil/ACiencia/badges/coverage.png?b=master&s=342159ea031ef8672005fb2ccb05b3f1a91f0af1)](https://scrutinizer-ci.com/g/FJavierGil/ACiencia/?branch=master)
> 🎯Implementación de una API REST para la gestión de aportaciones a la Ciencia

Este proyecto implementa una interfaz de programación [REST][rest] desarrollada sobre
el framework [Slim][slim]. La aplicación proporciona las operaciones
habituales para la gestión de Productos, Entidades y Personas.

Para hacer más sencilla la gestión de los datos se ha utilizado
el ORM [Doctrine][doctrine]. Doctrine 2 es un Object-Relational Mapper que proporciona
persistencia transparente para objetos PHP. Utiliza el patrón [Data Mapper][dataMapper]
con el objetivo de obtener un desacoplamiento completo entre la lógica de negocio y la
persistencia de los datos en los sistemas de gestión de bases de datos.

Para su configuración, este proyecto se apoya en el componente [Dotenv][dotenv], que
permite realizar la configuración a través de variables de entorno. De esta manera,
cualquier configuración que pueda variar entre diferentes entornos (desarrollo, pre-producción, producción, ...) puede ser establecida
a través de variables de entorno, tal como se aconseja en la metodología [“The twelve-factor app”][12factor] ✅.

Por otra parte se incluye parcialmente la especificación de la API (OpenAPI 3.0). Esta
especificación se ha elaborado empleando el editor [Swagger][swagger]. Adicionalmente 
también se incluye la interfaz de usuario (SwaggerUI) de esta fenomenal herramienta que permite
realizar pruebas interactivas de manera completa y elegante. La especificación entregada
define las operaciones sobre usuarios del sistema y sobre `Productos`, `Entidades` y `Personas`.

## ⚙Instalación del proyecto️

El primer paso consiste en generar un esquema de base de datos vacío y una pareja usuario/contraseña
con privilegios completos sobre dicho esquema.

Después se deberá crear una copia del fichero `./.env` y renombrarla
como `./.env.local`. A continuación se debe editar dicho fichero y modificar las variables `DATABASE_NAME`,
`DATABASE_USER` y `DATABASE_PASSWD` con los valores generados en el paso anterior (el resto de opciones
pueden quedar como comentarios). Una vez editado el anterior fichero y desde el directorio raíz del
proyecto se deben ejecutar los comandos:
```
> composer install
> bin/doctrine orm:schema:update --dump-sql --force
```
Para verificar la validez de la información de mapeo y la sincronización con la base de datos:
```
> bin/doctrine orm:validate
```

## 🗄️Estructura del proyecto

A continuación se describe el contenido y estructura más destacado del proyecto:

* Directorio `bin`:
    - Ejecutables (*doctrine*, *phpunit*, ...)
* Directorio `config`:
    - `config/cli-config.php`: configuración de la consola de comandos de Doctrine,
      configuración de la aplicación, asociación entre rutas y controladores, etc.
* Directorio `src`:
    - Subdirectorio `src/Entity`: entidades PHP (incluyen atributos de mapeo del ORM)
    - Subdirectorio `src/Controller`: controladores PHP (implementan los _endpoints_ de la API)
    - Subdirectorio `src/scripts`: scripts de ejemplo
* Directorio `public`:
    - Raíz de documentos del servidor web
    - `public/index.php`: controlador frontal
    - `public/api-docs`: especificación de la API (Swagger-UI)
    - `public/project`: parte front de la web junto con las peticiones ajax al servidor web
* Directorio `vendor`:
    - Componentes desarrollados por terceros (Doctrine, Dotenv, Slim, etc.)

## 🚀Puesta en marcha de la aplicación

Para acceder a la aplicación utilizando el servidor interno del intérprete
de PHP se ejecutará el comando:

```
> php -S 127.0.0.1:8000 -t public
```

Una vez hecho esto, la aplicación estará disponible en [http://127.0.0.1:8000/][lh].


[dataMapper]: http://martinfowler.com/eaaCatalog/dataMapper.html
[doctrine]: http://docs.doctrine-project.org/projects/doctrine-orm/en/latest/
[dotenv]: https://packagist.org/packages/vlucas/phpdotenv
[infection]: https://infection.github.io/guide/
[jwt]: https://jwt.io/
[lh]: http://127.0.0.1:8000/
[monolog]: https://github.com/Seldaek/monolog
[openapi]: https://www.openapis.org/
[phpunit]: http://phpunit.de/manual/current/en/index.html
[rest]: http://www.restapitutorial.com/
[slim]: https://www.slimframework.com/ 
[swagger]: http://swagger.io/
[yaml]: https://yaml.org/
[12factor]: https://www.12factor.net/es/
[phpmetrics]: https://phpmetrics.org/
[phpstan]: https://phpstan.org/
