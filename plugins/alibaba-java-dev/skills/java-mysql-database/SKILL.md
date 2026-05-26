---
name: java-mysql-database
description: Use when working with MySQL in Java — database schema, SQL, ORM mapping
---

# MySQL 数据库规约概述

本文档为 MySQL 数据库规约的父 skill，详细内容拆分为以下子 skill：

## 子规约索引

| 子 skill | 主题 | 触发路径 |
|----------|------|----------|
| mysql-table-design | 建表规约 | 无 paths（设计阶段） |
| mysql-sql-rules | SQL 语句 | 无 paths（通用型） |
| mysql-index | 索引规约 | `**/*.sql` |

## 核心原则

- 表名、字段名使用小写字母
- 禁用外键与级联，应用层处理
- 禁用存储过程
- 使用逻辑删除而非物理删除

---
> 详细规约请参考对应的子 skill 文件。