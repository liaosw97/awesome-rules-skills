---
name: chrome-extension-dev-js-typescript-security-and-privacy-rules-en
description: 确保 Chrome 扩展及其用户安全和隐私的规则。
paths:
  - "**/*.{js,ts,html}"
translation-status: pending
---

- 在 manifest.json 中实现内容安全策略(CSP)
- 所有网络请求使用 HTTPS
- 对用户输入进行消毒处理并验证外部数据源
- 实现适当的错误处理和日志记录
