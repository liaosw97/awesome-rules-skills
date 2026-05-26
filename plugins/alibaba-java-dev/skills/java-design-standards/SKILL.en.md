---
name: java-design-standards
description: Alibaba Java Development Handbook design standards overview. Use when designing software architecture, applying design patterns, or making design decisions in Java projects.
---

# Design Standards Overview

This document is the parent skill for Alibaba Java Development Handbook design standards. Detailed content is split into the following sub-skills:

## Sub-skill Index

| Sub-skill | Topic | Trigger Paths |
|-----------|-------|---------------|
| java-design-standards-principles | Design principles (UML, dependency inversion, DRY) | `**/design/**/*.java`, `**/architecture/**/*.java` |
| java-design-standards-version-history | Version history (release notes) | No paths (universal) |
| java-design-standards-glossary | Terminology (POJO, DTO, BO, VO) | No paths (universal) |
| java-design-standards-error-codes | Error codes (A/B/C categories) | `**/ErrorCode*.java`, `**/error/**/*.java` |

## Core Principles Summary

1. Storage scheme and data structure design must pass review and be documented
2. Use case diagrams, state diagrams, sequence diagrams, class diagrams, activity diagrams for complex designs
3. Identify weak dependencies and design degradation plans
4. Follow Single Responsibility, Dependency Inversion, Open-Closed, DRY principles

---

> For detailed rules, refer to corresponding sub-skill files.
