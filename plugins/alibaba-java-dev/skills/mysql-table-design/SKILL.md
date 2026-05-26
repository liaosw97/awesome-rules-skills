---
name: mysql-table-design
description: MySQL 建表规约 — 表命名、字段类型、必备字段。Use when creating or modifying database tables, designing schemas, defining field types.
---

# MySQL 建表规约

## 表命名规范

```sql
-- 正确：小写字母 + 下划线
CREATE TABLE aliyun_admin (...);
CREATE TABLE trade_config (...);

-- 错误：大写字母、驼峰
-- CREATE TABLE AliyunAdmin (...);  -- ❌
-- CREATE TABLE tradeConfig (...);  -- ❌
```

## 字段类型选择

| 场景 | 类型 | 说明 |
|------|------|------|
| 布尔值 | `tinyint unsigned` | 1=是, 0=否 |
| 小数 | `decimal` | 禁用 float/double |
| 定长字符串 | `char` | 长度几乎相等时 |
| 变长字符串 | `varchar(≤5000)` | 超过用 text 分表 |
| 年龄 | `tinyint unsigned` | 0-255 |
| 主键 | `bigint unsigned` | 自增 |

## 必备三字段

```sql
CREATE TABLE example (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    create_time DATETIME NOT NULL,
    update_time DATETIME NOT NULL
);
```

## 关键规则

1. **表名不用复数** — `user` 而非 `users`
2. **禁用保留字** — 如 `desc`, `range`, `match`
3. **逻辑删除** — 使用 `is_deleted` 字段，不用物理删除
4. **字段冗余** — 适当冗余提升查询性能，但需考虑一致性
