---
name: go-conventions
description: Use when writing Go code — project structure, naming conventions, code style, idiomatic Go
---

# Go 代码规范

## 核心原则

- 编写简洁、高效、可维护的代码
- 使用接口实现松耦合设计
- 优先组合而非继承
- 关注错误处理和资源管理

## 项目结构

```
project/
├── cmd/                # 应用入口
├── internal/           # 内部包
│   ├── handlers/       # HTTP 处理器
│   ├── services/       # 业务逻辑
│   ├── models/         # 数据模型
│   └── repository/     # 数据访问
├── pkg/                # 公共包
├── configs/            # 配置文件
└── go.mod
```

## 命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| 包名 | 简短小写 | `http` |
| 类型名 | PascalCase | `UserService` |
| 方法名 | PascalCase（导出） | `GetUser` |
| 变量名 | camelCase | `userID` |
| 常量名 | camelCase | `maxRetry` |

## 接口设计

```go
// 小接口原则
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}
```

## API 设计

```go
// RESTful 处理器
func (h *Handler) GetUser(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    user, err := h.service.GetUser(r.Context(), id)
    if err != nil {
        respondError(w, http.StatusNotFound, err.Error())
        return
    }
    respondJSON(w, http.StatusOK, user)
}
```