---
layout: post
title:  "Filament PHP v3 Global CSS Colors Configuration"
date:   2024-03-07
tags: [Filament, Laravel, PHP, CSS]
---

Hello there, this is my first post on this blog, and you should be expecting more from me!

I will be sharing some tips on how to use FLAT Stack and other technologies to build web and mobile applications so stay tuned.

As we all know, Filament v3 introduced the concept of multiple panels but it also introduced a new way to configure CSS colors for branding (which is a step away from the Tailwind CSS approach used in v2).

The new approach is nice and all but it also means you will have to configure branding colors for each panel you create or does it?

After a lot of source code viewing, I discovered that Filament will end up calling `Filament\Support\Facades\FilamentColor::register([ ... ])` after booting the panel when you configure the colors in your panel service provider like:

```php
...
->colors([
    'white' => Color::hex('#ffffff'),
    'black' => Color::hex('#212121'),
    'danger' => Color::hex('#f93232'),
    'gray' => Color::hex('#8a8894'),
    'info' => Color::hex('#00a3ff'),
    'primary' => Color::hex('#00a3ff'),
    'success' => Color::hex('#439f6e'),
    'warning' => Color::hex('#ffb82e'),
])
...
```

So this means we can move the color configuration to the `AppServiceProvider` and configure it once for all panels:

```php
use Illuminate\Support\ServiceProvider;
use Filament\Support\Facades\FilamentColor;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // ...
        
        FilamentColor::register([
            'white' => Color::hex('#ffffff'),
            'black' => Color::hex('#212121'),
            'danger' => Color::hex('#f93232'),
            'gray' => Color::hex('#8a8894'),
            'info' => Color::hex('#00a3ff'),
            'primary' => Color::hex('#00a3ff'),
            'success' => Color::hex('#439f6e'),
            'warning' => Color::hex('#ffb82e'),
        ]);
        
        // ...
    }
}
```

And this approach also allows you to customize the colors in each panel if you need to.

That's it for now, see you in the next post!
