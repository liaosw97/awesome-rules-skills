---
name: java-exception-logging
description: Use when handling exceptions or logging in Java — error codes, exception handling, logging rules
---

# Java 异常日志规约概述

本文档为 Java 异常日志规约的父 skill，详细内容拆分为以下子 skill：

## 子规约索引

| 子 skill | 主题 | 说明 |
|----------|------|------|
| java-exception-rules | 异常处理 | 捕获、抛出、事务回滚 |
| java-logging-rules | 日志规约 | 日志框架、级别、格式 |
| java-design-standards-error-codes | 错误码 | 错误码制定原则 |

## 核心原则

- 错误码快速溯源、沟通标准化
- 异常捕获后必须处理或抛给调用者
- 使用 SLF4J 门面模式日志框架

---
> 详细规约请参考对应的子 skill 文件。