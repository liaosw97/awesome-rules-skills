---
name: java-coding-standards-oop
description: Use when writing OOP Java code — POJO, entity, model, DTO, VO, equals, hashCode, toString
paths:
  - "**/src/**/entity/**/*.java"
  - "**/src/**/model/**/*.java"
  - "**/src/**/dto/**/*.java"
  - "**/src/**/vo/**/*.java"
---

# OOP Conventions

## (IV) OOP Conventions

1.【Mandatory】 Avoid accessing static variables or methods through object reference, use class name directly.

2.【Mandatory】 All overridden methods must have @Override annotation.
Explanation: getObject() vs get0bject() - letter O vs number 0.

3.【Mandatory】 Varargs can only be used when parameter types are same and have same business meaning, avoid Object type.

4.【Mandatory】 Do not modify method signatures of interfaces being called externally. Deprecated interfaces must have @Deprecated annotation.

5.【Mandatory】 Do not use deprecated classes or methods.

6.【Mandatory】 Object's equals method can throw NPE, use constant or non-null object to call equals.
Positive example: "test".equals(param);
Recommended: java.util.Objects#equals(Object a, Object b)

7.【Mandatory】 All Integer wrapper class object comparisons must use equals method.
Explanation: Integer objects between -128 and 127 are cached and reused.

8.【Mandatory】 Any currency amount must be stored as smallest currency unit in integer type.

9.【Mandatory】 Floating-point equality: primitive types cannot use ==, wrapper types cannot use equals.

10.【Mandatory】 BigDecimal equality should use compareTo() method, not equals() method.
Explanation: equals() compares value and precision.

11.【Mandatory】 When defining DO class, attribute types must match database field types.

12.【Mandatory】 Do not use BigDecimal(double) constructor to convert double to BigDecimal.
Positive example: Use String constructor or BigDecimal.valueOf().

13.【Mandatory】 All POJO class attributes must use wrapper types; RPC method return values and parameters must use wrapper types.

14.【Mandatory】 When defining POJO classes like DO/PO/DTO/VO, do not set any default values.

15.【Mandatory】 When adding new attributes to serialization class, do not modify serialVersionUID field.

16.【Mandatory】 No business logic in constructors, put initialization logic in init method.

17.【Mandatory】 POJO classes must have toString method. If inheriting another POJO, add super.toString().

18.【Mandatory】 Do not have both isXxx() and getXxx() methods for the same attribute xxx in POJO class.

19.【Recommended】 When using String split result with index, check if there's content after last separator.

20.【Recommended】 Multiple constructors or overloaded methods should be placed together.

21.【Recommended】 Method order in class: public/protected > private > getter/setter.

22.【Recommended】 In setter method, parameter name same as member variable. No business logic in getter/setter.

23.【Recommended】 Use StringBuilder.append() for string concatenation in loops.

24.【Recommended】 Use final keyword for classes, member variables, methods, and local variables where appropriate.

25.【Recommended】 Use Object.clone() with caution. Default is shallow copy.

26.【Recommended】 Strict access control for class members and methods.