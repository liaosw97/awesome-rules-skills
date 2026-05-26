---
name: abp-application
description: ABP 应用层 — 应用服务、DTO、权限授权。Use when implementing application services, DTOs, permission authorization in ABP.
paths:
  - "**/Application/**/*.cs"
---

# ABP 应用层

## DTO 定义

```csharp
// 使用 record 类型
public record CreateUpdateUserDto(
    string UserName,
    string Email,
    string? PhoneNumber
);

public record UserDto(
    Guid Id,
    string UserName,
    string Email
);
```

## 应用服务

```csharp
[Authorize(MyProjectPermissions.Users.Create)]
public class UserAppService(
    IUserRepository userRepository) : ApplicationService, IUserAppService
{
    public async Task<UserDto> CreateAsync(CreateUpdateUserDto input)
    {
        var user = new User(GuidGenerator.Create(), input.UserName, input.Email);
        await userRepository.InsertAsync(user);
        return ObjectMapper.Map<User, UserDto>(user);
    }

    public async Task<UserDto> GetAsync(Guid id)
    {
        var user = await userRepository.FindAsync(id)
            ?? throw new EntityNotFoundException(typeof(User), id);
        return ObjectMapper.Map<User, UserDto>(user);
    }
}
```

## 实体配置

```csharp
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        builder.Property(x => x.UserName).IsRequired().HasMaxLength(256);
        builder.HasIndex(x => x.Email).IsUnique();
    }
}
```