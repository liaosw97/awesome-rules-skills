---
name: java-design-standards-glossary
description: Use when looking up Java development terminology — POJO, DO, DTO, BO, VO, CAS, GAV, OOP, AQS, ORM, NPE, OOM
---

# Glossary

## Appendix 2: Terminology

1. **POJO** (Plain Ordinary Java Object): In this convention, POJO refers to simple classes with only setter/getter/toString, including DO/DTO/BO/VO.

2. **DO** (Data Object): Alibaba-specific term for POJO classes corresponding one-to-one with database tables, transmitted upward through DAO layer.

3. **PO** (Persistent Object): Also refers to POJO classes corresponding one-to-one with database tables.

4. **DTO** (Data Transfer Object): Data transfer object, objects transmitted outward by Service or Manager.

5. **BO** (Business Object): Business object, objects output by Service layer encapsulating business logic.

6. **Query**: Data query object, receiving upper layer query requests at each layer. For queries with more than 2 parameters, do not use Map for transmission.

7. **VO** (View Object): View object, usually objects transmitted from Web to template rendering engine.

8. **CAS** (Compare And Swap): Mechanism solving lock performance overhead in multi-threaded parallel situations, hardware-implemented atomic operation. Contains three operands: memory location, expected original value, and new value.

9. **GAV** (GroupId, ArtifactId, Version): Maven coordinates, uniquely identifying jar packages.

10. **OOP** (Object Oriented Programming): Refers to class and object programming approaches.

11. **AQS** (AbstractQueuedSynchronizer): Low-level synchronization tool using FIFO queue, foundation for ReentrantLock, CountDownLatch, Semaphore, etc.

12. **ORM** (Object Relation Mapping): Object-relational mapping, conversion between object domain model and underlying data. Refers to iBATIS, mybatis frameworks.

13. **NPE** (java.lang.NullPointerException): Null pointer exception.

14. **OOM** (Out Of Memory): From java.lang.OutOfMemoryError, when JVM lacks memory for object allocation and garbage collector cannot reclaim space.

15. **GMT** (Greenwich Mean Time): Standard time from Royal Greenwich Observatory, London. Now UTC (Coordinated Universal Time) provided by atomic clocks.

16. **First-party library**: Libraries (jar packages) depended on by internal subproject modules.

17. **Second-party library**: Libraries published to central repository by company, available for other internal applications.

18. **Third-party library**: Open source libraries (jar packages) from outside the company.