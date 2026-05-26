---
name: java-design-standards
description: 阿里巴巴 Java 开发手册设计规约概述。Use when designing software architecture, applying design patterns, or making design decisions in Java projects.
---

# 设计规约概述

本文档为阿里巴巴 Java 开发手册设计规约的父 skill，详细内容拆分为以下子 skill：

## 子规约索引

| 子 skill | 主题 | 触发路径 |
|----------|------|----------|
| java-design-standards-principles | 设计原则（UML、依赖倒置、DRY） | `**/design/**/*.java`, `**/architecture/**/*.java` |
| java-design-standards-version-history | 版本历史（发布记录） | 无 paths（通用型） |
| java-design-standards-glossary | 专有名词（POJO、DTO、BO、VO） | 无 paths（通用型） |
| java-design-standards-error-codes | 错误码列表（A/B/C 类错误） | `**/ErrorCode*.java`, `**/error/**/*.java` |

## 核心原则摘要

1. 存储方案和底层数据结构设计需评审通过并沉淀文档
2. 使用用例图、状态图、时序图、类图、活动图表达复杂设计
3. 识别弱依赖并设计降级预案
4. 遵循单一原则、依赖倒置、开闭原则、DRY 原则

---

> 详细规约请参考对应的子 skill 文件。
