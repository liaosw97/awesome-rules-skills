---
name: java-design-standards-error-codes
description: Use when working with error codes — user errors, system errors, third-party service errors, error handling
paths:
  - "**/ErrorCode*.java"
  - "**/error/**/*.java"
  - "**/*Error*.java"
---

# Error Code List

## Appendix 3: Error Codes

### Primary Macro Error Codes

| Code | Description | Notes |
|------|-------------|-------|
| 00000 | All OK | Return after successful execution |
| A0001 | User-side error | Primary macro error code |
| B0001 | System execution error | Primary macro error code |
| C0001 | Third-party service error | Primary macro error code |

### User-side Errors (Category A)

#### User Registration Errors (A0100)
- A0100 User registration error (secondary macro)
- A0101 User did not agree to privacy policy
- A0102 Registration country/region restricted
- A0110 Username validation failed
- A0111 Username already exists
- A0112 Username contains sensitive words
- A0120 Password validation failed
- A0121 Password length insufficient
- A0122 Password strength insufficient
- A0130 Verification code input error

#### User Login Exceptions (A0200)
- A0200 User login exception (secondary macro)
- A0201 User account does not exist
- A0202 User account frozen
- A0203 User account deprecated
- A0210 User password error
- A0211 Password error attempts exceeded
- A0220 User identity verification failed
- A0230 User login expired
- A0240 User verification code error

#### Access Permission Exceptions (A0300)
- A0300 Access permission exception (secondary macro)
- A0301 Access unauthorized
- A0310 Blocked by privacy settings
- A0311 Authorization expired
- A0320 User access blocked
- A0321 Blacklisted user
- A0322 Account frozen
- A0323 Illegal IP address
- A0330 Service overdue

#### User Request Parameter Errors (A0400)
- A0400 User request parameter error (secondary macro)
- A0401 Contains illegal redirect link
- A0402 Invalid user input
- A0410 Required parameter empty
- A0420 Parameter value out of range
- A0430 User input content illegal
- A0440 User operation exception

#### User Request Service Exceptions (A0500)
- A0500 User request service exception (secondary macro)
- A0501 Request count exceeded
- A0502 Request concurrency exceeded
- A0506 Duplicate user request

#### User Resource Exceptions (A0600)
- A0600 User resource exception (secondary macro)
- A0601 Insufficient account balance
- A0602 Insufficient user disk space

#### User Upload File Exceptions (A0700)
- A0700 User upload file exception (secondary macro)
- A0701 File type mismatch
- A0702 File too large

### System Execution Errors (Category B)

- B0100 System execution timeout
- B0200 System disaster recovery triggered
- B0210 System rate limiting
- B0220 System degradation
- B0300 System resource exception
- B0310 System resource exhausted
- B0311 System disk space exhausted
- B0312 System memory exhausted

### Third-party Service Errors (Category C)

- C0100 Middleware service error
- C0110 RPC service error
- C0111 RPC service not found
- C0120 Message service error
- C0130 Cache service error
- C0140 Configuration service error
- C0200 Third-party system timeout
- C0300 Database service error
- C0311 Table not found
- C0312 Column not found
- C0331 Database deadlock
- C0341 Primary key conflict
- C0400 Third-party disaster recovery triggered
- C0500 Notification service error
