---
name: abp-domain
description: ABP 领域层 — 实体、聚合根、值对象、领域服务。Use when designing domain entities, aggregate roots, value objects in ABP.
paths:
  - "**/Domain/**/*.cs"
---

# ABP 领域层

## 聚合根定义

```csharp
public class User : AggregateRoot<Guid>
{
    public string UserName { get; private set; }
    public string Email { get; private set; }

    private User() { } // ORM 需要

    public User(Guid id, string userName, string email) : base(id)
    {
        UserName = userName;
        Email = email;
    }

    public void UpdateEmail(string email)
    {
        Email = email;
        AddLocalEvent(new UserEmailChangedEvent(Id, email));
    }
}
```

## 值对象

```csharp
public class EmailAddress : ValueObject
{
    public string Address { get; private set; }

    private EmailAddress() { }

    public EmailAddress(string address)
    {
        Address = address;
    }

    protected override IEnumerable<object> GetAtomicValues()
    {
        yield return Address;
    }
}
```

## 仓储接口

```csharp
public interface IUserRepository : IRepository<User, Guid>
{
    Task<User?> FindByUserNameAsync(string userName);
}
```