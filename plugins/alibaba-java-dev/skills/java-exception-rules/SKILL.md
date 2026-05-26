---
name: java-exception-rules
description: Java 异常处理规约 — 捕获、抛出、事务回滚。Use when handling exceptions in Java, try-catch blocks, exception propagation.
---

# Java 异常处理规约

## 异常捕获原则

```java
// 预检查规避 RuntimeException
if (obj != null) { obj.method(); }  // ✓
// try { obj.method(); } catch (NullPointerException e) {}  // ❌

// 分清稳定和非稳定代码
try {
    // 非稳定代码：区分异常类型
} catch (BusinessException e) {
    // 业务异常处理
} catch (SystemException e) {
    // 系统异常处理
}
```

## 异常抛出规范

```java
// 不抛 RuntimeException/Exception/Throwable
throw new ServiceException("业务异常");  // ✓
// throw new RuntimeException("...");  // ❌

// 捕获异常必须处理或抛给调用者
try {
    // ...
} catch (Exception e) {
    logger.error("操作失败", e);
    throw e;  // 抛给调用者
}
```

## 事务与异常

```java
// catch 后需手动回滚事务
@Transactional
public void update() {
    try {
        // 业务逻辑
    } catch (Exception e) {
        // 手动回滚
        TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
    }
}
```

## NPE 防护场景

```java
// 使用 Optional 防止 NPE
Optional.ofNullable(obj).map(User::getName).orElse("");

// 远程调用空指针判断
User user = remoteService.getUser(id);
if (user != null) { ... }  // 必须判断
```