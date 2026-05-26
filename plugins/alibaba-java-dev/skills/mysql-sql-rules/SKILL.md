---
name: mysql-sql-rules
description: MySQL SQL语句规约 — 查询、更新、分页优化。Use when writing SQL queries, optimizing performance, handling pagination.
---

# MySQL SQL 语句规约

## 查询规范

```sql
-- 统计行数使用 count(*)
SELECT COUNT(*) FROM users;

-- 避免左模糊和全模糊
-- WHERE name LIKE '%keyword'  -- ❌ 索引失效
-- WHERE name LIKE 'keyword%'  -- ✓ 可用索引

-- 使用 ISNULL() 判断 NULL
SELECT * FROM table WHERE ISNULL(column);
```

## 分页优化

```sql
-- 延迟关联优化超多分页
SELECT t1.*
FROM table1 AS t1,
     (SELECT id FROM table1 WHERE condition LIMIT 100000, 20) AS t2
WHERE t1.id = t2.id;
```

## 多表查询

```sql
-- 超过 3 表禁止 join
-- 关联字段必须有索引
-- 列名必须加表别名
SELECT t1.name
FROM first_table AS t1, second_table AS t2
WHERE t1.id = t2.id;
```

## 关键规则

1. **禁用 `SELECT *`** — 明确列出所需字段
2. **禁用外键和级联** — 应用层处理
3. **禁用存储过程** — 难以调试和扩展
4. **in 操作控制在 1000 个之内**
5. **更新时必须更新 update_time**
