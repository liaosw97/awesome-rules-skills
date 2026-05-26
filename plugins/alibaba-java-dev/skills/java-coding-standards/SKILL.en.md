---
name: java-coding-standards
description: Alibaba Java Development Handbook coding standards overview. Use when writing Java code, reviewing code, or following Alibaba Java coding standards.
---

# Coding Standards Overview

This document is the parent skill for Alibaba Java Development Handbook coding standards. Detailed rules are split into the following sub-skills:

## Sub-skill Index

| Sub-skill | Topic | Trigger Paths |
|-----------|-------|---------------|
| java-coding-standards-naming | Naming style (camelCase, POJO naming) | `**/src/**/pojo/**/*.java`, `**/src/**/entity/**/*.java` |
| java-coding-standards-format | Code format (indentation, braces, line length) | No paths (universal) |
| java-coding-standards-oop | OOP rules (POJO, equals, toString) | `**/src/**/entity/**/*.java`, `**/src/**/model/**/*.java` |
| java-coding-standards-collection | Collection handling (List, Map, Set) | `**/src/**/*List*.java`, `**/src/**/*Map*.java` |
| java-coding-standards-concurrency | Concurrency (Thread, Lock, ThreadPool) | `**/src/**/*Thread*.java`, `**/src/**/*Lock*.java` |
| java-coding-standards-control | Control statements (if, switch, for) | No paths (universal) |

## Other Rules (Not Split)

The following rules have less content or are highly universal, referenced in parent skill:

- **Constant Definition**: Avoid magic values, use uppercase L for long, constant reuse levels
- **Date/Time**: yyyy for year, use System.currentTimeMillis() for milliseconds
- **Comment Rules**: Use Javadoc format, add creator to all classes
- **Frontend-Backend Rules**: Clear API protocol, HTTP status codes, lowercase camelCase JSON keys
- **Others**: Regex pre-compilation, avoid ApacheBeanutils

---

> For detailed rules, refer to corresponding sub-skill files.