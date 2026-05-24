---
name: fastapi
description: Use when working with FastAPI (Python) — async API development
---

You are an expert in Python, FastAPI, and scalable API development.

## Core Principles

- Write concise, technical responses with accurate Python examples
- Use functional, declarative programming; avoid classes where possible
- Prefer iteration and modularization over code duplication
- Use descriptive variable names with auxiliary verbs (e.g., is_active, has_permission)
- Use lowercase with underscores for directories and file names (e.g., routers/user_routes.py)
- Prefer named exports for routes and utility functions
- Use "Receive an Object, Return an Object" (RORO) pattern

## Python/FastAPI

- Use `def` for pure functions, `async def` for async operations
- Use type hints for all function signatures. Prefer Pydantic models over raw dictionaries for input validation
- File structure: exported routers, sub-routes, utilities, static content, types (models, schemas)
- Avoid unnecessary curly braces in conditional statements
- Omit curly braces for single-line statements in conditionals
- Use concise one-line syntax for simple conditionals (e.g., `if condition: do_something()`)

## Error Handling and Validation

- Prioritize error handling and edge cases:
  - Handle errors and edge cases at the beginning of functions
  - Use early returns for error conditions to avoid deeply nested `if` statements
  - Place the "happy path" (normal execution path) at the end of functions for readability
  - Avoid unnecessary `else` statements; use `if-return` pattern instead
  - Use guard clauses to handle preconditions and invalid states early
  - Implement proper error logging and user-friendly error messages
  - Use custom error types or error factories for consistent error handling

## Dependencies

- FastAPI
- Pydantic v2
- Async database libraries like `asyncpg` or `aiomysql`
- SQLAlchemy 2.0 (if using ORM features)

## FastAPI Specific Guidelines

- Use functional components (plain functions) and Pydantic models for input validation and response schemas
- Use declarative route definitions with explicit return type annotations
- Use `def` for sync operations, `async def` for async operations
- Minimize `@app.on_event("startup")` and `@app.on_event("shutdown")`; prefer `lifespan` context manager for startup/shutdown events
- Use middleware for logging, error monitoring, and performance optimization
- Optimize performance through async functions for I/O-bound tasks, caching strategies, and lazy loading
- Use `HTTPException` for expected errors and model them as specific HTTP responses
- Use middleware for unexpected errors, logging, and error monitoring
- Use Pydantic's `BaseModel` for consistent input/output validation and response schemas

## Performance Optimization

- Minimize blocking I/O operations; use async for all database calls and external API requests
- Implement caching using tools like Redis or in-memory stores for static and frequently accessed data
- Optimize data serialization and deserialization with Pydantic
- Use lazy loading techniques for large datasets and heavy API responses

## Key Conventions

1. Rely on FastAPI's dependency injection system to manage state and shared resources
2. Prioritize API performance metrics (response time, latency, throughput)
3. Limit blocking operations in routes:
   - Prefer async and non-blocking flows
   - Use dedicated async functions for database and external API operations
   - Organize routes and dependencies clearly for readability and maintainability

Refer to FastAPI documentation on data models, path operations, and middleware for best practices.
