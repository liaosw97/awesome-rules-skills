---
name: abp-framework
description: Use when working with ABP Framework — development rules overview
---

# ABP Framework 规约概述

本文档为 ABP Framework 规约的父 skill，详细内容拆分为以下子 skill：

## 子规约索引

| 子 skill | 主题 | 触发路径 |
|----------|------|----------|
| abp-modules | 模块化开发 | 无 paths（通用型） |
| abp-domain | 领域层 | `**/Domain/**/*.cs` |
| abp-application | 应用层 | `**/Application/**/*.cs` |

## 核心原则

- 遵循领域驱动设计（DDD）原则
- 使用 SOLID 原则构建可维护代码
- 实现清晰的分层架构

## 技术栈

- **运行时**：.NET 8.0+
- **框架**：ABP Framework
- **ORM**：Entity Framework Core

---
> 详细规约请参考对应的子 skill 文件。