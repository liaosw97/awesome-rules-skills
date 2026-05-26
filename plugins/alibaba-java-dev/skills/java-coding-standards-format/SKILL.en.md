---
name: java-coding-standards-format
description: Use when writing or formatting Java code — code style, indentation, braces, line length, spacing
---

# Code Format Conventions

## (III) Code Format

1.【Mandatory】 If braces are empty, write {} concisely; for non-empty code blocks:
1) No newline before left brace.
2) Newline after left brace.
3) Newline before right brace.
4) No newline after right brace if followed by else; terminating right brace must have newline.

2.【Mandatory】 No space between left parenthesis and adjacent character on right; no space between right parenthesis and adjacent character on left; space before left brace.
Counterexample: if(space a == b space)

3.【Mandatory】 if / for / while / switch / do keywords must have spaces between them and parentheses.

4.【Mandatory】 Any binary or ternary operator must have a space on both sides.
Explanation: Includes assignment operator =, logical operator &&, arithmetic operators, etc.

5.【Mandatory】 Use 4 spaces for indentation, forbid Tab characters.
Explanation: If using Tab, must set 1 Tab to 4 spaces.

6.【Mandatory】 There must be exactly one space between double slash and comment content.
Positive example: // This is example comment, note there's one space after double slash

7.【Mandatory】 When casting types, no space between right parenthesis and cast value.
Positive example: double first = 3.2D; int second = (int)first + 2;

8.【Mandatory】 Single line character limit is 120, beyond that need line break:
1) Second line indents 4 spaces relative to first, third line onwards no further indentation.
2) Operator breaks with following text.
3) Method call dot breaks with following text.
4) Multiple parameters break after comma.
5) No break before parenthesis.

9.【Mandatory】 Method parameters in definition and passing must have space after comma.
Positive example: method(args1, args2, args3);

10.【Mandatory】 IDE text file encoding set to UTF-8; line separator use Unix format, not Windows format.

11.【Recommended】 Single method total lines should not exceed 80.
Explanation: Includes method signature, braces, code, blank lines, and invisible characters except comments.

12.【Recommended】 No need to add spaces to align assignment operators with previous line.

13.【Recommended】 Insert blank line between different logic, semantics, or business code to improve readability.