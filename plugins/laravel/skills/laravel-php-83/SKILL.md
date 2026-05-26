---
name: laravel-php-83
description: Use when working with PHP — development rules, Laravel conventions, PHP 8.3 features
---

# Laravel PHP 8.3 规约概述

本文档为 Laravel PHP 8.3 开发规约的父 skill，详细内容拆分为以下子 skill：

## 子规约索引

| 子 skill | 主题 | 触发路径 |
|----------|------|----------|
| laravel-routing | 路由规约（RESTful、路由组） | `**/routes/**/*.php` |
| laravel-eloquent | Eloquent ORM（模型、关联） | `**/app/Models/**/*.php` |
| laravel-middleware | 中间件（认证、过滤） | `**/app/Http/Middleware/**/*.php` |

## 核心原则

- 遵循 Laravel 约定和最佳实践
- 使用 PHP 8.3+ 现代特性（类型化属性、枚举、只读类）
- 实现类型安全和完整的文档块
- 保持代码简洁、可测试、可维护

## 技术栈

- **语言**：PHP 8.3+
- **框架**：Laravel 10/11
- **数据库**：MySQL / PostgreSQL
- **缓存/队列**：Redis

## 安全实践

- 使用 Laravel 内置的 CSRF 保护
- 验证所有用户输入
- 使用参数化查询防止 SQL 注入
- 使用 bcrypt/argon2 加密密码

---

> 详细规约请参考对应的子 skill 文件。
