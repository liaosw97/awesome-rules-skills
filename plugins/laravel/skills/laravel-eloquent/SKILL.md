---
name: laravel-eloquent
description: Use when working with Laravel Eloquent ORM — models, relationships, queries, eager loading, mutators
paths:
  - "**/app/Models/**/*.php"
---

# Laravel Eloquent 规约

## 模型规范

### 1. 模型结构

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Model
{
    protected $fillable = [
        'name',
        'email',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}
```

### 2. 命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| 模型名 | PascalCase 单数 | `User` |
| 表名 | snake_case 复数 | `users` |
| 外键 | snake_case + `_id` | `user_id` |
| 透视表 | 两表名按字母顺序 | `role_user` |

## 关联关系

```php
// 一对多
public function posts(): HasMany
{
    return $this->hasMany(Post::class);
}

// 一对一
public function profile(): HasOne
{
    return $this->hasOne(Profile::class);
}

// 多对多
public function roles(): BelongsToMany
{
    return $this->belongsToMany(Role::class);
}
```

## 查询最佳实践

### 避免 N+1 问题

```php
// 使用 Eager Loading
$users = User::with('posts')->get();

// 延迟 Eager Loading
$users->load('posts.comments');
```

### 查询作用域

```php
// 模型中定义
public function scopeActive($query)
{
    return $query->where('is_active', true);
}

// 使用
$users = User::active()->get();
```
