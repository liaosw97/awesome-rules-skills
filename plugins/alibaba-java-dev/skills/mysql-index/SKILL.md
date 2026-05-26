---
name: mysql-index
description: MySQL 索引规约 — 索引设计、优化策略。Use when creating indexes, optimizing query performance, analyzing execution plans.
paths:
  - "**/*.sql"
---

# MySQL 索引规约

## 索引命名

| 类型 | 命名规则 | 示例 |
|------|---------|------|
| 主键索引 | `pk_字段名` | `pk_id` |
| 唯一索引 | `uk_字段名` | `uk_email` |
| 普通索引 | `idx_字段名` | `idx_name` |

## 索引设计原则

```sql
-- 唯一特性字段必须建唯一索引
CREATE UNIQUE INDEX uk_email ON users(email);

-- 组合索引：区分度高的在左边
-- WHERE a = ? AND b = ? ORDER BY c
CREATE INDEX idx_a_b_c ON table(a, b, c);

-- varchar 字段指定索引长度
CREATE INDEX idx_name ON users(name(20));
```

## 索引使用

```sql
-- 利用覆盖索引避免回表
-- EXPLAIN 结果 Extra 列显示 "Using index"

-- 利用索引有序性
-- ORDER BY 字段是组合索引最后部分
WHERE a = ? AND b = ? ORDER BY c;  -- 索引: idx_a_b_c ✓
WHERE a > 10 ORDER BY b;           -- 索引: idx_a_b 无法排序
```

## 性能目标

| 级别 | 说明 | 要求 |
|------|------|------|
| const | 主键/唯一索引单行 | 最佳 |
| ref | 普通索引 | 要求 |
| range | 范围检索 | 最低 |
| index | 全索引扫描 | 避免 |
