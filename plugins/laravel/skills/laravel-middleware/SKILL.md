---
name: laravel-middleware
description: Use when working with Laravel middleware — authentication, authorization, request filtering, CORS
paths:
  - "**/app/Http/Middleware/**/*.php"
---

# Laravel 中间件规约

## 中间件结构

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role)
    {
        if (!$request->user()->hasRole($role)) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}
```

## 中间件类型

### 1. 全局中间件

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->append([
        \App\Http\Middleware\ForceHttps::class,
    ]);
})
```

### 2. 路由中间件

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role' => \App\Http\Middleware\CheckRole::class,
        'admin' => \App\Http\Middleware\AdminOnly::class,
    ]);
})
```

## 常用中间件

### 认证检查

```php
class Authenticate
{
    public function handle($request, Closure $next)
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }
        return $next($request);
    }
}
```

### CORS 处理

```php
// config/cors.php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['https://example.com'],
'allowed_headers' => ['*'],
```

## 注册中间件

```php
// 路由中使用
Route::get('/admin', fn() => 'Admin')
    ->middleware(['auth', 'admin']);
```
