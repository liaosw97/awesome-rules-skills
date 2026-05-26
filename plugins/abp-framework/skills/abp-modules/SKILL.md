---
name: abp-modules
description: ABP 模块化开发 — 项目结构、命名约定。Use when setting up ABP project structure, defining modules, organizing code layers.
---

# ABP 模块化开发

## 项目结构

```
src/
├── MyProject.Domain/           # 领域层
│   ├── Entities/               # 实体和聚合根
│   ├── Repositories/           # 仓储接口
│   └── DomainServices/         # 领域服务
├── MyProject.Application/      # 应用层
│   ├── Services/               # 应用服务
│   └── DTOs/                   # 数据传输对象
├── MyProject.HttpApi/          # HTTP API
└── MyProject.Web/              # Web 层
```

## 命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| 项目名 | PascalCase | `MyProject` |
| 接口名 | I + PascalCase | `IUserAppService` |
| 方法名 | PascalCase | `GetUserAsync` |
| 变量名 | camelCase | `userRepository` |

## 模块定义

```csharp
[DependsOn(
    typeof(AbpAutofacModule),
    typeof(AbpEntityFrameworkCoreModule)
)]
public class MyProjectModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // 配置服务
    }
}
```