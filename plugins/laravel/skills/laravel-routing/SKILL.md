---
name: laravel-routing
description: Use when working with Laravel routes — routing, API routes, web routes, route groups, middleware
paths:
  - "**/routes/**/*.php"
---

# Laravel 路由规约

## 路由结构

```
routes/
├── web.php      # Web 界面路由
├── api.php      # API 路由
├── console.php  # 命令行路由
└── channels.php # 广播频道
```

## 路由规范

### 1. RESTful 路由

```php
// 资源路由
Route::resource('users', UserController::class);

// 仅需要的操作
Route::resource('users', UserController::class)
    ->only(['index', 'show', 'store', 'update']);

// 排除特定操作
Route::resource('users', UserController::class)
    ->except(['destroy']);
```

### 2. 路由组

```php
Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('users', AdminUserController::class);
    });
```

### 3. API 路由版本控制

```php
Route::prefix('v1')
    ->middleware(['auth:api'])
    ->group(function () {
        Route::apiResource('users', Api\V1\UserController::class);
    });
```

## 命名约定

- 使用 kebab-case URL 路径
- 使用蛇形命名的路由名称
- 使用资源控制器方法名

```php
// 推荐
Route::get('user-profiles', [ProfileController::class, 'index'])
    ->name('user-profiles.index');

// 避免
Route::get('userProfiles', ...);
```

## 中间件应用

```php
// 单个路由
Route::get('profile', [ProfileController::class, 'show'])
    ->middleware('auth');

// 路由组
Route::middleware(['auth', 'admin'])
    ->group(function () {
        // ...
    });
```
