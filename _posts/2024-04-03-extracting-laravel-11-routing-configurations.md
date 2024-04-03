---
layout: post
title:  "Extracting Laravel 11 Routing Configurations"
date:   2024-04-03
tags: [Laravel, PHP]
---

Hello, world!

This continues my previous post on [Extracting Laravel 11 Bootstrap Configurations](/blog/2024/03/18/extracting-laravel-11-bootstrap-configurations).

In this post, I will discuss how to extract Laravel 11 routing configurations so let's begin.

Extracting the Laravel 11 routing configurations to a separate file is similar to other extractions that was discussed in the previous post but let me list some caveats that you need to be aware of:

1. You will need to manually register each route group yourself since `withRouting` ignores every other parameters if you are passing the `using` parameter which we will be using in this post.
2. You will need to manually register the new health route because of the reason above.
3. And finally, because you are registering things manually, you might miss out from future updates that Laravel will introduce to `withRouting` method.

So, if you are fine with the caveats above, let's get started.

Let's start by creating the bootstrapper file:

```shell
artisan make:class -i Bootstrappers/RoutingBootstrapper
```

Next, let's open the newly created file and add the following code:

```php
<?php

namespace App\Bootstrappers;

use Illuminate\Routing\Router;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Event;
use Illuminate\Foundation\Events\DiagnosingHealth;

class RoutingBootstrapper
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
    public function __invoke(Router $router): void
    {
        // API routes
        $router->middleware('api')
               ->prefix('api')
               ->group(base_path('routes/api.php'));

        // Web routes
        $router->middleware('web')
               ->group(base_path('routes/web.php'));

        // Health route
        $router->middleware('web')->get('/up', function () {
            $viewFile = base_path('/vendor/laravel/framework/src/Illuminate/Foundation/resources/health-up.blade.php');
            
            Event::dispatch(new DiagnosingHealth);
            
            return View::file($viewFile);
        });
    }
}
```

You are free to add or remove routes as you see fit then you can now use the `RoutingBootstrapper` class in the `bootstrap/app.php` file:

```php
<?php

use Illuminate\Foundation\Application;

return Application::configure(basePath: dirname(__DIR__))
                  ->withRouting((new App\Bootstrappers\RoutingBootstrapper)(...))
                  ->withMiddleware(new App\Bootstrappers\MiddlewareBootstrapper)
                  ->withExceptions(new App\Bootstrappers\ExceptionsBootstrapper)
                  ->create();
```

As I mentioned earlier, the `withRouting` configuration is kind of different from the other methods because it accepts a `Closure` not `callable` which is why it is important to add the `(...)` after the invocation of the class which essentially converts a `callable` to a `Closure`, you can read more about the first-callable syntax [here](https://www.php.net/manual/en/functions.first_class_callable_syntax.php).

And that's it! Until next time, happy coding!
