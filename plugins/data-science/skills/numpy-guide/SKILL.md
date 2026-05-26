---
name: numpy-guide
description: Use when working with NumPy — array operations, numerical computing, linear algebra
paths:
  - "**/*numpy*.py"
---

# NumPy 最佳实践

## 数组创建

```python
import numpy as np

# 基本创建
arr = np.array([1, 2, 3])
zeros = np.zeros((3, 3))
ones = np.ones((3, 3))
arange = np.arange(0, 10, 2)
linspace = np.linspace(0, 1, 5)
```

## 数组操作

```python
# 形状操作
arr.reshape(3, 4)
arr.flatten()
arr.transpose()

# 切片
arr[0:5]
arr[:, 1]  # 二维切片
arr[arr > 5]  # 布尔索引
```

## 数学运算

```python
# 基本运算
np.add(arr1, arr2)
np.multiply(arr1, arr2)
np.dot(arr1, arr2)  # 矩阵乘法

# 统计函数
np.mean(arr)
np.std(arr)
np.sum(arr)
np.argmax(arr)
```

## 广播机制

```python
# 自动广播
arr + 5  # 标量广播
arr + np.array([1, 2, 3])  # 向量广播
```