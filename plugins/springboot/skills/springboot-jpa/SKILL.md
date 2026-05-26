---
name: springboot-jpa
description: Use when working with Spring Boot JPA — development rules overview
---

# SpringBoot JPA 规约概述

本文档为 SpringBoot JPA 规约的父 skill，详细内容拆分为以下子 skill：

## 子规约索引

| 子 skill | 主题 | 触发路径 |
|----------|------|----------|
| springboot-jpa-entity-class-conventions | 实体类规范 | `**/entities/*.java` |
| springboot-jpa-repository-class-conventions | Repository 规范 | `**/repositories/*.java` |
| springboot-jpa-restcontroller-conventions | Controller 规范 | `**/controllers/*.java` |
| springboot-jpa-dto-conventions | DTO 规范 | 无 paths |
| springboot-jpa-apiresponse-class | ApiResponse 类 | 无 paths |
| springboot-jpa-globalexceptionhandler-class | 异常处理 | 无 paths |

## 核心原则

- 遵循 SOLID、DRY、KISS、YAGNI 原则
- 使用分层架构实现清晰的职责分离
- 统一异常处理和响应格式

## 技术栈

- **框架**：Spring Boot 3 / Java 17
- **ORM**：Spring Data JPA
- **构建**：Maven / Lombok

---
> 详细规约请参考对应的子 skill 文件。