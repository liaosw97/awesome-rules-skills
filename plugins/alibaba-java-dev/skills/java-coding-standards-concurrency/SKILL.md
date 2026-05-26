---
name: java-coding-standards-concurrency
description: Use when writing concurrent Java code — Thread, Lock, ThreadPool, Concurrent, synchronization, volatile
paths:
  - "**/src/**/*Thread*.java"
  - "**/src/**/*Lock*.java"
  - "**/src/**/*Pool*.java"
  - "**/src/**/*Concurrent*.java"
---

# 并发处理规约

## (七) 并发处理

1.【强制】 获取单例对象需要保证线程安全，其中的方法也要保证线程安全。
说明：资源驱动类、工具类、单例工厂类都需要注意。

2.【强制】 创建线程或线程池时请指定有意义的线程名称，方便出错时回溯。

3.【强制】 线程资源必须通过线程池提供，不允许在应用中自行显式创建线程。
说明：线程池的好处是减少创建和销毁线程的时间开销。

4.【强制】 线程池不允许使用 Executors 去创建，而是通过 ThreadPoolExecutor 的方式。
说明：Executors 返回的线程池对象弊端：FixedThreadPool 和 SingleThreadPool 允许请求队列长度为 Integer.MAX_VALUE；CachedThreadPool 允许创建线程数量为 Integer.MAX_VALUE。

5.【强制】 SimpleDateFormat 是线程不安全的类，一般不要定义为 static 变量，如果定义为 static，必须加锁，或者使用 DateUtils 工具类。
说明：JDK8 可以使用 Instant、LocalDateTime、DateTimeFormatter 代替。

6.【强制】 必须回收自定义的 ThreadLocal 变量，尽量在代码中使用 try-finally 块进行回收。

7.【强制】 高并发时，同步调用应该去考量锁的性能损耗。能用无锁数据结构，就不要用锁；能锁区块，就不要锁整个方法体。

8.【强制】 对多个资源、数据库表、对象同时加锁时，需要保持一致的加锁顺序，否则可能会造成死锁。

9.【强制】 在使用阻塞等待获取锁的方式中，必须在 try 代码块之外，并且在加锁方法与 try 代码块之间没有任何可能抛出异常的方法调用。

10.【强制】 在使用尝试机制来获取锁的方式中，进入业务代码块之前，必须先判断当前线程是否持有锁。

11.【强制】 并发修改同一记录时，避免更新丢失，需要加锁。要么在应用层加锁，要么在缓存加锁，要么在数据库层使用乐观锁。

12.【强制】 多线程并行处理定时任务时，Timer 运行多个 TimeTask 时，只要其中之一没有捕获抛出的异常，其它任务便会自动终止运行，使用 ScheduledExecutorService 则没有这个问题。

13.【推荐】 资金相关的金融敏感信息，使用悲观锁策略。

14.【推荐】 使用 CountDownLatch 进行异步转同步操作，每个线程退出前必须调用 countDown 方法。

15.【推荐】 避免 Random 实例被多线程使用。
正例：JDK7 之后，可以直接使用 ThreadLocalRandom。

16.【推荐】 通过双重检查锁实现延迟初始化需要将目标属性声明为 volatile 型。

17.【参考】 volatile 解决多线程内存不可见问题，对于一写多读是可以解决变量同步问题，但多写同样无法解决线程安全问题。
说明：JDK8 推荐使用 LongAdder，比 AtomicLong 性能更好。

18.【参考】 HashMap 在容量不够进行 resize 时由于高并发可能出现死链，导致 CPU 飙升。

19.【参考】 ThreadLocal 对象使用 static 修饰，ThreadLocal 无法解决共享对象的更新问题。
