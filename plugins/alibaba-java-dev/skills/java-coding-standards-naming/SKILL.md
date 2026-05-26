---
name: java-coding-standards-naming
description: Use when writing Java naming code — camelCase, naming style, POJO naming, class naming, method naming, constant naming
paths:
  - "**/src/**/pojo/**/*.java"
  - "**/src/**/entity/**/*.java"
  - "**/src/**/dto/**/*.java"
  - "**/src/**/vo/**/*.java"
---

# 命名风格规约

## (一) 命名风格

1.【强制】 所有编程相关的命名均不能以 下划线或美元符号 开始或结束。
反例：_name / __name / $Object / name_ / name$ / Object$

2.【强制】 所有编程相关的命名严禁使用拼音与英文混合的方式，更不允许直接使用中文的方式。
正例：ali / alibaba / taobao / kaikeba / aliyun / youku / hangzhou 等国际通用的名称，可视同英文。

3.【强制】 代码和注释中都要避免使用任何种族歧视性或侮辱性词语。
正例：blockList / allowList / secondary
反例：blackList / whiteList / slave / SB / WTF

4.【强制】 类名使用 UpperCamelCase 风格，以下情形例外：DO / PO / DTO / BO / VO / UID 等。
正例：ForceCode / UserDO / HtmlDTO / XmlService / TcpUdpDeal / TaPromotion
反例：forcecode / UserDo / HTMLDto / XMLService / TCPUDPDeal / TAPromotion

5.【强制】 方法名、参数名、成员变量、局部变量都统一使用 lowerCamelCase 风格。
正例：localValue / getHttpMessage() / inputUserId

6.【强制】 常量命名应该全部大写，单词间用下划线隔开，力求语义表达完整清楚。
正例：MAX_STOCK_COUNT / CACHE_EXPIRED_TIME
反例：MAX_COUNT / EXPIRED_TIME

7.【强制】 抽象类命名使用 Abstract 或 Base 开头；异常类命名使用 Exception 结尾；测试类命名以被测试类名开始，以 Test 结尾。

8.【强制】 类型与中括号紧挨相连来定义数组。
正例：定义整形数组 int[] arrayDemo。
反例：在 main 参数中，使用 String args[] 来定义。

9.【强制】 POJO 类中的布尔类型变量，都不要加 is 前缀，否则部分框架解析会引起序列化错误。
反例：定义为 Boolean isDeleted，getter 方法也是 isDeleted()，部分框架反向解析时误以为字段名是 deleted。

10.【强制】 包名统一使用小写，点分隔符之间有且仅有一个自然语义的英语单词。包名统一使用单数形式，但类名如有复数含义可使用复数形式。
正例：com.alibaba.ei.kunlun.aap.util；类名为 MessageUtils。

11.【强制】 避免在子父类的成员变量之间、或不同代码块的局部变量之间采用完全相同的命名，降低可理解性。

12.【强制】 杜绝完全不规范的英文缩写，避免望文不知义。
反例：AbstractClass 缩写成 AbsClass；condition 缩写成 condi；Function 缩写成 Fu。

13.【推荐】 为了达到代码自解释的目标，任何自定义编程元素在命名时，使用完整的单词组合来表达。
正例：AtomicReferenceFieldUpdater。

14.【推荐】 在常量与变量命名时，表示类型的名词放在词尾，以提升辨识度。
正例：startTime / workQueue / nameList / TERMINATED_THREAD_COUNT

15.【推荐】 如果模块、接口、类、方法使用了设计模式，在命名时要体现出具体模式。
正例：OrderFactory / LoginProxy / ResourceObserver。

16.【推荐】 接口类中的方法和属性不要加任何修饰符号（public 也不要加），保持代码简洁，并加上有效的 Javadoc 注释。

17. 接口和实现类的命名有两套规则：
1）【强制】 对于 Service 和 DAO 类，暴露出来的服务一定是接口，内部实现类用 Impl 后缀与接口区别。
正例：CacheServiceImpl 实现 CacheService 接口。
2）【推荐】 如果是形容能力的接口名称，取对应的形容词为接口名（通常是 –able 结尾）。
正例：AbstractTranslator 实现 Translatable。

18.【参考】 枚举类名带上 Enum 后缀，枚举成员名称需要全大写，单词间用下划线隔开。
正例：ProcessStatusEnum 的成员名称：SUCCESS / UNKNOWN_REASON

19.【参考】 各层命名规约：
A）Service / DAO 层方法命名：get（单个对象）、list（多个对象）、count（统计值）、save/insert（插入）、remove/delete（删除）、update（修改）做前缀。
B）领域模型命名：xxxDO（数据对象）、xxxDTO（数据传输对象）、xxxVO（展示对象）、POJO 是 DO/DTO/BO/VO 的统称，禁止命名成 xxxPOJO。
