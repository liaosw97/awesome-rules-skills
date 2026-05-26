---
name: pandas-guide
description: Use when working with Pandas — DataFrame operations, data cleaning, data transformation
paths:
  - "**/*pandas*.py"
  - "**/*dataframe*.py"
---

# Pandas 最佳实践

## DataFrame 操作

```python
import pandas as pd

# 读取数据
df = pd.read_csv('data.csv')
df = pd.read_parquet('data.parquet')

# 基本操作
df.head()
df.info()
df.describe()

# 选择数据
df[['col1', 'col2']]
df[df['col1'] > 10]
df.loc[0:5, 'col1']
df.iloc[0:5, 0]
```

## 数据清洗

```python
# 处理缺失值
df.dropna()
df.fillna(0)
df['col'].fillna(df['col'].mean())

# 去重
df.drop_duplicates()

# 类型转换
df['col'] = df['col'].astype('int64')
df['date'] = pd.to_datetime(df['date'])
```

## 数据聚合

```python
# 分组聚合
df.groupby('category').agg({
    'value': ['sum', 'mean', 'count']
})

# 数据透视表
pd.pivot_table(df, values='value', index='row', columns='col')
```

## 性能优化

```python
# 使用向量化操作
df['new_col'] = df['col1'] + df['col2']

# 避免 iterrows
for idx, row in df.iterrows():  # 慢
    ...

# 使用 itertuples 或向量化
for row in df.itertuples():  # 更快
    ...
```