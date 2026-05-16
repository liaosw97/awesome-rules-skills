---
name: chrome-extension-dev-js-typescript-performance-optimization-rules-en
description: 优化扩展性能、减少资源使用和提高响应速度的规则。
paths:
  - "**/background_worker.js, **/content_script.js"
translation-status: pending
---

- 最小化后台脚本的资源使用
- 尽可能使用事件页面而非持久性后台页面
- 对非关键扩展功能实现懒加载
- 优化内容脚本以最小化对网页性能的影响
