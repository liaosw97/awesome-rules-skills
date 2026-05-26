---
name: data-validation
description: Use when validating data — Pydantic, Pandera, schema validation, data quality
---

# 数据验证规约

## Pydantic 模型

```python
from pydantic import BaseModel, Field, validator

class User(BaseModel):
    id: int
    name: str = Field(..., min_length=1, max_length=100)
    email: str
    age: int = Field(..., ge=0, le=150)

    @validator('email')
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('invalid email')
        return v
```

## Pandera 验证

```python
import pandera as pa

schema = pa.DataFrameSchema({
    'id': pa.Column(int, checks=pa.Check.ge(0)),
    'name': pa.Column(str, checks=pa.Check.str_length(min_value=1)),
    'value': pa.Column(float, nullable=True),
})

# 验证 DataFrame
validated_df = schema.validate(df)
```

## 数据质量检查

```python
# 检查缺失值
assert df.isnull().sum().sum() == 0

# 检查唯一性
assert df['id'].is_unique

# 检查范围
assert df['age'].between(0, 150).all()
```