---
name: go-concurrency
description: Use when writing concurrent Go code — goroutines, channels, sync primitives, context
paths:
  - "**/*goroutine*.go"
  - "**/*channel*.go"
  - "**/*sync*.go"
---

# Go 并发规约

## Goroutine 最佳实践

```go
// 使用 WaitGroup 等待完成
func processItems(items []Item) []Result {
    results := make(chan Result, len(items))
    var wg sync.WaitGroup

    for _, item := range items {
        wg.Add(1)
        go func(i Item) {
            defer wg.Done()
            results <- processItem(i)
        }(item)
    }

    go func() {
        wg.Wait()
        close(results)
    }()

    var allResults []Result
    for r := range results {
        allResults = append(allResults, r)
    }
    return allResults
}
```

## Channel 使用

```go
// 带缓冲 channel
ch := make(chan int, 100)

// 单向 channel
func producer(ch chan<- int) { ... }
func consumer(ch <-chan int) { ... }

// select 多路复用
select {
case msg := <-ch1:
    // 处理消息
case ch2 <- data:
    // 发送数据
case <-time.After(timeout):
    // 超时处理
}
```

## Context 使用

```go
// 设置超时
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

// 传递 context
result, err := service.GetData(ctx, id)

// 取消操作
if ctx.Err() == context.Canceled {
    // 处理取消
}
```

## 同步原语

```go
// Mutex
var mu sync.Mutex
mu.Lock()
// 受保护的代码
mu.Unlock()

// RWMutex
var rwmu sync.RWMutex
rwmu.RLock()  // 读锁
rwmu.Lock()   // 写锁
```