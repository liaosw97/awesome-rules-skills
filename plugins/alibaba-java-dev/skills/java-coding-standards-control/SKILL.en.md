---
name: java-coding-standards-control
description: Use when writing Java control statements — if, else, for, while, switch, ternary operator
---

# Control Statement Conventions

## (VIII) Control Statements

1.【Mandatory】 In a switch block, each case must terminate with continue/break/return, or comment explaining which case it falls through to. Must include default statement at the end, even if empty.
Explanation: Note break exits switch block, return exits method.

2.【Mandatory】 When switch variable type is String and is external parameter, must check for null first.

3.【Mandatory】 Must use braces in if / else / for / while / do statements.
Explanation: Even for single line code, use braces.

4.【Mandatory】 In ternary operator condition ? expr1 : expr2, be aware of potential NPE from auto-unboxing when type alignment occurs.
Explanation: If either expr is primitive type or types don't match, will force unboxing.

5.【Mandatory】 In high concurrency scenarios, avoid using "equals" as termination condition.
Explanation: Use greater-than or less-than range conditions instead.

6.【Recommended】 When method code exceeds 10 lines, add blank line after right brace of return/throw logic.

7.【Recommended】 For exceptional branches, minimize if-else usage.
Explanation: If using if-else, do not exceed 3 levels.

8.【Recommended】 Avoid complex statements in conditionals. Assign complex logic result to a meaningful boolean variable.

9.【Recommended】 Do not insert assignment statements in other expressions (especially conditional expressions).

10.【Recommended】 Consider performance in loop body. Move object definition, variable, database connection, unnecessary try-catch outside loop.

11.【Recommended】 Avoid negative logic operators.
Positive example: Use if(x < 628) for x less than 628.
Counterexample: Use if(!(x >= 628)) for x less than 628.

12.【Recommended】 Public interfaces need parameter protection, especially batch operations.

13.【Reference】 Parameter validation needed for:
1) Low frequency methods.
2) High execution time methods.
3) High stability/availability methods.
4) External open interfaces.
5) Sensitive permission entry points.

14.【Reference】 Parameter validation not needed for:
1) Methods likely called in loops.
2) High frequency底层 methods.
3) Private methods only called by own code.