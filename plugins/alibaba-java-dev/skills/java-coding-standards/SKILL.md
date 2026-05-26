---
name: java-coding-standards
description: 阿里巴巴 Java 开发手册编程规约概述。Use when writing Java code, reviewing code, or following Alibaba Java coding standards.
---

# 编程规约概述

本文档为阿里巴巴 Java 开发手册编程规约的父 skill，详细规约拆分为以下子 skill：

## 子规约索引

| 子 skill | 主题 | 触发路径 |
|----------|------|----------|
| java-coding-standards-naming | 命名风格（camelCase、POJO 命名） | `**/src/**/pojo/**/*.java`, `**/src/**/entity/**/*.java` |
| java-coding-standards-format | 代码格式（缩进、大括号、行长度） | 无 paths（通用型） |
| java-coding-standards-oop | OOP 规约（POJO、equals、toString） | `**/src/**/entity/**/*.java`, `**/src/**/model/**/*.java` |
| java-coding-standards-collection | 集合处理（List、Map、Set） | `**/src/**/*List*.java`, `**/src/**/*Map*.java` |
| java-coding-standards-concurrency | 并发处理（Thread、Lock、ThreadPool） | `**/src/**/*Thread*.java`, `**/src/**/*Lock*.java` |
| java-coding-standards-control | 控制语句（if、switch、for） | 无 paths（通用型） |

## 其他规约（未拆分）

以下规约内容较少或通用性强，保留在父 skill 中引用：

- **常量定义**：避免魔法值、long 使用大写 L、常量复用层次
- **日期时间**：yyyy 表示年份、获取毫秒数使用 System.currentTimeMillis()
- **注释规约**：使用 Javadoc 格式、所有类添加创建者
- **前后端规约**：API 明确协议、HTTP 状态码、JSON key 小写驼峰
- **其他**：正则预编译、避免 ApacheBeanutils

---

> 详细规约请参考对应的子 skill 文件。