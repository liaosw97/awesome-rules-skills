---
name: go-error-handling
description: Use when handling errors in Go — error types, error wrapping, panic recovery
paths:
  - "**/*error*.go"
---

# Go 错误处理规约

## 错误类型

```go
// 自定义错误类型
type AppError struct {
    Code    int
    Message string
    Err     error
}

func (e *AppError) Error() string {
    if e.Err != nil {
        return fmt.Sprintf("%s: %v", e.Message, e.Err)
    }
    return e.Message
}

func (e *AppError) Unwrap() error {
    return e.Err
}
```

## 错误处理模式

### 1. 显式错误检查

```go
func ProcessFile(path string) ([]byte, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("reading file %s: %w", path, err)
    }
    return data, nil
}
```

### 2. 错误包装

```go
// 使用 %w 包装错误
if err != nil {
    return fmt.Errorf("failed to process: %w", err)
}
```

### 3. Panic 恢复

```go
func SafeOperation() (err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("panic recovered: %v", r)
        }
    }()
    // 可能 panic 的操作
    return nil
}
```

## 错误检查

```go
// 检查特定错误
if errors.Is(err, os.ErrNotExist) {
    // 文件不存在
}

// 检查错误类型
var appErr *AppError
if errors.As(err, &appErr) {
    // 处理 AppError
}
```