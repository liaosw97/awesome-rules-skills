---
name: java-design-standards-principles
description: Use when designing software architecture — design principles, UML diagrams, system design, dependency inversion, DRY
paths:
  - "**/design/**/*.java"
  - "**/architecture/**/*.java"
---

# Design Principles

## VII. Design Conventions

1.【Mandatory】 Storage scheme and underlying data structure design must pass review consensus and be documented.

2.【Mandatory】 During requirement analysis, if interacting Users exceed one category and related UseCases exceed 5, use case diagrams to express clearer structured requirements.

3.【Mandatory】 If a business object has more than 3 states, use state diagrams to express and clarify each trigger condition for state changes.

4.【Mandatory】 If a function's call chain involves more than 3 objects, use sequence diagrams to express and clarify input/output of each call.

5.【Mandatory】 If system has more than 5 model classes with complex dependencies, use class diagrams to express relationships.

6.【Mandatory】 If more than 2 objects have collaborative relationships with complex processing flows, use activity diagrams.

7.【Mandatory】 Accurately identify weak dependencies during system design, and design degradation and contingency plans to ensure core system availability.

8.【Recommended】 System architecture design should clarify: system boundaries, inter-module relationships, design principles for evolution, non-functional requirements.

9.【Recommended】 Requirement analysis and system design should fully evaluate exception flows and business boundaries while considering main functions.

10.【Recommended】 Class design and implementation should follow Single Responsibility Principle.

11.【Recommended】 Use inheritance cautiously for extension, prefer aggregation/composition. Must follow Liskov Substitution Principle if inheritance is necessary.

12.【Recommended】 During system design, follow Dependency Inversion Principle, depend on abstract classes and interfaces.

13.【Recommended】 During system design, follow Open-Closed Principle - open for extension, closed for modification.

14.【Recommended】 Extract common business or public behaviors into public modules, configurations, classes, methods - DRY principle (Don't Repeat Yourself).

15.【Recommended】 Avoid misunderstanding: agile development ≠ story telling + coding + release.

16.【Reference】 Design document purpose: clarify requirements, organize logic, future maintenance. Secondary purpose: guide coding.

17.【Reference】 Essence of extensibility: find system change points and isolate them.

18.【Reference】 Essence of design: identify and express system difficulties.

19.【Reference】 "Code is documentation" is wrong. Clear code is only a fragment of documentation, not the whole.

20.【Reference】 For accessible product design: all interactive controls must be tab-focusable, provide alternative verification methods for CAPTCHA, clarify custom control interaction types.
