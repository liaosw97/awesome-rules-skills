---
name: java-coding-standards-oop
description: Use when writing OOP Java code — POJO, entity, model, DTO, VO, equals, hashCode, toString
paths:
  - "**/src/**/entity/**/*.java"
  - "**/src/**/model/**/*.java"
  - "**/src/**/dto/**/*.java"
  - "**/src/**/vo/**/*.java"
---

# OOP 规约

## (四) OOP 规约

1.【强制】 避免通过一个类的对象引用访问此类的静态变量或静态方法，无谓增加编译器解析成本，直接用类名来访问即可。

2.【强制】 所有的覆写方法，必须加 @Override 注解。
说明：getObject() 与 get0bject() 的问题。一个是字母的 O，一个是数字的 0，加 @Override 可以准确判断是否覆盖成功。

3.【强制】 相同参数类型，相同业务含义，才可以使用的可变参数，参数类型避免定义为 Object。
说明：可变参数必须放置在参数列表的最后。

4.【强制】 外部正在调用的接口或者二方库依赖的接口，不允许修改方法签名。接口过时必须加 @Deprecated 注解，并清晰地说明采用的新接口。

5.【强制】 不能使用过时的类或方法。

6.【强制】 Object 的 equals 方法容易抛空指针异常，应使用常量或确定有值的对象来调用 equals。
正例："test".equals(param);
说明：推荐使用 java.util.Objects#equals(Object a, Object b)

7.【强制】 所有整型包装类对象之间值的比较，全部使用 equals 方法比较。
说明：对于 Integer var = ? 在 -128 至 127 之间的赋值，Integer 对象在 IntegerCache.cache 产生，会复用已有对象。

8.【强制】 任何货币金额，均以最小货币单位且为整型类型进行存储。

9.【强制】 浮点数之间的等值判断，基本数据类型不能使用 == 进行比较，包装数据类型不能使用 equals 进行判断。
说明：浮点数采用"尾数+阶码"的编码方式，二进制无法精确表示大部分的十进制小数。

10.【强制】 BigDecimal 的等值比较应使用 compareTo() 方法，而不是 equals() 方法。
说明：equals() 方法会比较值和精度（1.0 与 1.00 返回结果为 false），而 compareTo() 则会忽略精度。

11.【强制】 定义数据对象 DO 类时，属性类型要与数据库字段类型相匹配。
正例：数据库字段的 bigint 必须与类属性的 Long 类型相对应。

12.【强制】 禁止使用构造方法 BigDecimal(double) 的方式把 double 值转化为 BigDecimal 对象。
说明：BigDecimal(double) 存在精度损失风险。
正例：优先推荐入参为 String 的构造方法，或使用 BigDecimal 的 valueOf 方法。

13.【强制】 所有的 POJO 类属性必须使用包装数据类型；RPC 方法的返回值和参数必须使用包装数据类型。
说明：POJO 类属性没有初值是提醒使用者在需要使用时必须自己显式地进行赋值。

14.【强制】 定义 DO / PO / DTO / VO 等 POJO 类时，不要设定任何属性默认值。

15.【强制】 序列化类新增属性时，请不要修改 serialVersionUID 字段，避免反序列失败。

16.【强制】 构造方法里面禁止加入任何业务逻辑，如果有初始化逻辑，请放在 init 方法中。

17.【强制】 POJO 类必须写 toString 方法。使用 IDE 工具 source > generate toString 时，如果继承了另一个 POJO 类，注意在前面加一下 super.toString()。

18.【强制】 禁止在 POJO 类中，同时存在对应属性 xxx 的 isXxx() 和 getXxx() 方法。

19.【推荐】 使用索引访问用 String 的 split 方法得到的数组时，需做最后一个分隔符后有无内容的检查。

20.【推荐】 当一个类有多个构造方法，或者多个同名方法，这些方法应该按顺序放置在一起，便于阅读。

21.【推荐】 类内方法定义的顺序依次是：公有方法或保护方法 > 私有方法 > getter / setter 方法。

22.【推荐】 setter 方法中，参数名称与类成员变量名称一致，this.成员名 = 参数名。在 getter / setter 方法中，不要增加业务逻辑。

23.【推荐】 循环体内，字符串的连接方式，使用 StringBuilder 的 append 方法进行扩展。

24.【推荐】 final 可以声明类、成员变量、方法、以及本地变量。

25.【推荐】 慎用 Object 的 clone 方法来拷贝对象。
说明：对象 clone 方法默认是浅拷贝，若想实现深拷贝需覆写 clone 方法。

26.【推荐】 类成员与方法访问控制从严：
1）如果不允许外部直接通过 new 来创建对象，那么构造方法必须是 private。
2）工具类不允许有 public 或 default 构造方法。
3）类非 static 成员变量并且与子类共享，必须是 protected。
4）类非 static 成员变量并且仅在本类使用，必须是 private。
5）类 static 成员变量如果仅在本类使用，必须是 private。
6）类成员方法只供类内部调用，必须是 private。
7）类成员方法只对继承类公开，那么限制为 protected。
