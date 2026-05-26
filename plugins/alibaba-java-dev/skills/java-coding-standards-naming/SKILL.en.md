---
name: java-coding-standards-naming
description: Use when writing Java naming code — camelCase, naming style, POJO naming, class naming, method naming, constant naming
paths:
  - "**/src/**/pojo/**/*.java"
  - "**/src/**/entity/**/*.java"
  - "**/src/**/dto/**/*.java"
  - "**/src/**/vo/**/*.java"
---

# Naming Style Conventions

## (I) Naming Style

1.【Mandatory】 All programming-related names must not start or end with an underscore or dollar sign.
Counterexample: _name / __name / $Object / name_ / name$ / Object$

2.【Mandatory】 All programming-related names must strictly avoid using a mix of Pinyin and English, and must not use Chinese directly.
Positive example: ali / alibaba / taobao / kaikeba / aliyun / youku / hangzhou and other internationally recognized names.

3.【Mandatory】 Avoid using any racially discriminatory or offensive words in code and comments.
Positive example: blockList / allowList / secondary
Counterexample: blackList / whiteList / slave / SB / WTF

4.【Mandatory】 Class names use UpperCamelCase style, with exceptions: DO / PO / DTO / BO / VO / UID, etc.
Positive example: ForceCode / UserDO / HtmlDTO / XmlService / TcpUdpDeal / TaPromotion

5.【Mandatory】 Method names, parameter names, member variables, and local variables all use lowerCamelCase style.
Positive example: localValue / getHttpMessage() / inputUserId

6.【Mandatory】 Constant names should be all uppercase, separated by underscores, striving for complete semantic clarity.
Positive example: MAX_STOCK_COUNT / CACHE_EXPIRED_TIME

7.【Mandatory】 Abstract class names use Abstract or Base prefix; Exception class names use Exception suffix; Test class names start with the class being tested and end with Test.

8.【Mandatory】 Types and square brackets are closely connected to define arrays.
Positive example: int[] arrayDemo.

9.【Mandatory】 Any boolean variable in POJO class should not have is prefix, otherwise some frameworks will cause serialization errors.

10.【Mandatory】 Package names use lowercase uniformly, with only one natural semantic English word between dot separators.

11.【Mandatory】 Avoid using exactly the same naming between member variables of parent and child classes, or between local variables in different code blocks.

12.【Mandatory】 Eliminate completely non-standard English abbreviations.
Counterexample: AbstractClass to AbsClass; condition to condi; Function to Fu.

13.【Recommended】 Use complete word combinations when naming any custom programming element.
Positive example: AtomicReferenceFieldUpdater.

14.【Recommended】 When naming constants and variables, put the noun indicating type at the end.
Positive example: startTime / workQueue / nameList / TERMINATED_THREAD_COUNT

15.【Recommended】 If a module, interface, class, or method uses a design pattern, the specific pattern should be reflected in the naming.
Positive example: OrderFactory / LoginProxy / ResourceObserver.

16.【Recommended】 Methods and properties in interface classes should not have any modifier symbols (not even public).

17. Interface and implementation class naming:
1)【Mandatory】 For Service and DAO classes, exposed services must be interfaces, internal implementation classes use Impl suffix.
Positive example: CacheServiceImpl implements CacheService.
2)【Recommended】 If it's an interface name describing capability, use the corresponding adjective as interface name (usually –able ending).

18.【Reference】 Enum class names use Enum suffix, enum member names must be all uppercase.
Positive example: ProcessStatusEnum member names: SUCCESS / UNKNOWN_REASON

19.【Reference】 Naming conventions for each layer:
A) Service / DAO layer method naming: get (single object), list (multiple objects), count (statistics), save/insert, remove/delete, update as prefix.
B) Domain model naming: xxxDO (data object), xxxDTO (data transfer object), xxxVO (view object), POJO is the collective term for DO/DTO/BO/VO.
