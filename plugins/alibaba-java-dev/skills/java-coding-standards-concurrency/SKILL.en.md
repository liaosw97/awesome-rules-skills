---
name: java-coding-standards-concurrency
description: Use when writing concurrent Java code — Thread, Lock, ThreadPool, Concurrent, synchronization, volatile
paths:
  - "**/src/**/*Thread*.java"
  - "**/src/**/*Lock*.java"
  - "**/src/**/*Pool*.java"
  - "**/src/**/*Concurrent*.java"
---

# Concurrency Processing Conventions

## (VII) Concurrency Processing

1.【Mandatory】 Singleton objects must guarantee thread safety, methods inside must also be thread-safe.

2.【Mandatory】 Specify meaningful thread names when creating threads or thread pools.

3.【Mandatory】 Thread resources must be provided through thread pools, not explicitly created in application.

4.【Mandatory】 Do not use Executors to create thread pools, use ThreadPoolExecutor instead.
Explanation: Executors drawbacks - FixedThreadPool/SingleThreadPool queue length Integer.MAX_VALUE, CachedThreadPool thread count Integer.MAX_VALUE.

5.【Mandatory】 SimpleDateFormat is not thread-safe, do not define as static. If static, must lock or use DateUtils.
Explanation: JDK8 can use Instant, LocalDateTime, DateTimeFormatter instead.

6.【Mandatory】 Must recycle custom ThreadLocal variables, use try-finally block.

7.【Mandatory】 Consider lock performance cost in high concurrency. Use lock-free structures if possible; lock blocks, not whole methods.

8.【Mandatory】 When locking multiple resources/tables/objects, maintain consistent locking order to avoid deadlock.

9.【Mandatory】 In blocking lock acquisition, lock() must be outside try block, with no exception-throwing methods between lock() and try.

10.【Mandatory】 In try-lock mechanism, must check if current thread holds the lock before entering business code.

11.【Mandatory】 When concurrently modifying same record, lock to prevent update loss. Application-level lock, cache lock, or database optimistic lock.

12.【Mandatory】 When multiple threads handle scheduled tasks, use ScheduledExecutorService, not Timer.

13.【Recommended】 Use pessimistic lock for financial sensitive information.

14.【Recommended】 Use CountDownLatch for async-to-sync conversion, each thread must call countDown before exiting.

15.【Recommended】 Avoid Random instance being used by multiple threads.
Positive example: JDK7+ use ThreadLocalRandom.

16.【Recommended】 Double-checked locking requires volatile declaration for target attribute.

17.【Reference】 volatile solves memory visibility for one-write-multiple-reads, but not for multiple writes.
Explanation: JDK8 recommends LongAdder over AtomicLong for better performance.

18.【Reference】 HashMap may have dead chain during resize in high concurrency, causing CPU spike.

19.【Reference】 ThreadLocal objects should use static modifier. ThreadLocal cannot solve shared object update problems.