---
name: go
description: Use when working with Go — development rules, concurrency, error handling
---

# Go 开发规约概述

本文档为 Go 开发规约的父 skill，详细内容拆分为以下子 skill：

## 子规约索引

| 子 skill | 主题 | 触发路径 |
|----------|------|----------|
| go-conventions | 代码规范（项目结构、命名） | 无 paths（通用型） |
| go-error-handling | 错误处理（错误类型、包装） | `**/*error*.go` |
| go-concurrency | 并发编程（goroutine、channel） | `**/*goroutine*.go`, `**/*channel*.go` |

## 核心原则

- 编写简洁、高效、可维护的代码
- 利用 Go 的并发特性提高性能
- 使用接口实现松耦合设计
- 优先组合而非继承

## 技术栈

- **语言**：Go 1.21+
- **API**：REST / gRPC
- **数据库**：PostgreSQL / MySQL
- **容器化**：Docker / Kubernetes

---

> 详细规约请参考对应的子 skill 文件。
