---
layout: post
title:  "Extracting Laravel 11 Bootstrap Configurations"
date:   2024-03-18
tags: [Laravel, PHP]
---

Laravel 11 introduced the slim boilerplate that is a great starting point for new projects. It is a great way to start a new project with a minimal set of configurations and dependencies.

These changes also includes moving middleware and exceptions handler to the `bootstrap/app.php` file which can become easily cluttered with a lot of configurations.

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Middleware
        // More Middleware
        // More and more Middleware
        // ...
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Exceptions
        // More Exceptions
        // More and more Exceptions
        // ...
    })
    ->create();
```

Because these methods accepts `callable` type, we can extract the configurations into separate classes and use them in the `bootstrap/app.php` file.

So let's see how we can extract these configurations into separate classes to make the `bootstrap/app.php` file cleaner and more maintainable.

We will also make use of one of the new `make:*` commands which is `artisan make:class` to create the new classes and also I will be calling them `Bootstrappers` as they are responsible for bootstrapping the application.

## Extracting Middleware

Start by creating a new invokable `MiddlewareBootstrapper` class using the `make:class` command.

```bash
artisan make:class -i Bootstrappers/MiddlewareBootstrapper
```

This will create a new `MiddlewareBootstrapper` class in the `App\Bootstrappers` namespace, now we can move the middleware configurations from the `bootstrap/app.php` file to the `MiddlewareBootstrapper` class.

```php
<?php

namespace App\Bootstrappers;

use Illuminate\Foundation\Configuration\Middleware;

class MiddlewareBootstrapper
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Invoke the class instance.
     */
    public function __invoke(Middleware $middleware): void
    {
        // Middleware
        // More Middleware
        // More and more Middleware
        // ...
    }
}
```

Now we can use the `MiddlewareBootstrapper` class in the `bootstrap/app.php` file.

```php
<?php

use Illuminate\Foundation\Application;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(new App\Bootstrappers\MiddlewareBootstrapper())
    ->withExceptions(function (Exceptions $exceptions) {
        // Exceptions
        // More Exceptions
        // More and more Exceptions
        // ...
    })
    ->create();
```

## Extracting Exceptions

Now let's create a new invokable `ExceptionsBootstrapper` class using the `make:class` command.

```bash
artisan make:class -i Bootstrappers/ExceptionsBootstrapper
```

This will create a new `ExceptionsBootstrapper` class in the `App\Bootstrappers` namespace, now we can move the exceptions configurations from the `bootstrap/app.php` file to the `ExceptionsBootstrapper` class.

```php
<?php

namespace App\Bootstrappers;

use Illuminate\Foundation\Configuration\Exceptions;

class ExceptionsBootstrapper
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Invoke the class instance.
     */
    public function __invoke(Exceptions $exceptions): void
    {
        // Exceptions
        // More Exceptions
        // More and more Exceptions
        // ...
    }
}
```

Now we can use the `ExceptionsBootstrapper` class in the `bootstrap/app.php` file.

```php
<?php

use Illuminate\Foundation\Application;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(new App\Bootstrappers\MiddlewareBootstrapper())
    ->withExceptions(new App\Bootstrappers\ExceptionsBootstrapper())
    ->create();
```

## Conclusion

After extracting the middleware and exceptions configurations into separate classes, the `bootstrap/app.php` file is now cleaner and more maintainable.

This also makes it easier to test the middleware and exceptions configurations as they are now separate classes.

You notice the `withRouting` method too? I will be explaining how to extract the routing configurations into a separate class in the next post.

I hope you find this helpful and let me know if you have any questions or suggestions.

Happy coding!
