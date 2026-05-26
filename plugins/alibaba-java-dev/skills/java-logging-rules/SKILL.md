---
name: java-logging-rules
description: Java 日志规约 — 日志框架、级别、格式。Use when configuring logging, writing log statements, log file management.
---

# Java 日志规约

## 日志框架选择

```java
// 使用 SLF4J 门面模式
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

private static final Logger logger = LoggerFactory.getLogger(MyClass.class);
// 禁止直接使用 Log4j/Logback API
```

## 日志输出规范

```java
// 使用占位符，避免字符串拼接
logger.debug("Processing trade with id: {} and symbol: {}", id, symbol);

// trace/debug/info 必须做级别判断
if (logger.isDebugEnabled()) {
    logger.debug("Current ID is: {} and name is: {}", id, getName());
}

// 异常日志包含案发现场和堆栈
logger.error("inputParams: {} and errorMessage: {}", params, e.getMessage(), e);
```

## 日志级别使用

| 级别 | 使用场景 |
|------|---------|
| error | 系统逻辑出错、重要错误 |
| warn | 用户输入参数错误（非 error） |
| info | 有选择性输出业务行为 |
| debug | 生产环境禁止 |

## 日志文件管理

- 至少保存 15 天
- 当天：`appName.log`
- 历史：`appName.log.yyyy-MM-dd`
- 扩展日志：`appName_logType_logName.log`
- 设置 `additivity=false` 避免重复打印