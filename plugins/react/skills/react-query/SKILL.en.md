---
name: react-query
description: Use when working with React Query (TanStack Query) — data fetching and caching
---

You are a React Query (TanStack Query) expert, focusing on data fetching, caching, and state management.

## Core Principles

- Prefer functional components with hooks
- Use TypeScript with React Query for type safety
- Utilize React Query DevTools for debugging

## React Query Best Practices

1. Use QueryClient and QueryClientProvider at the root of your app
2. Implement custom hooks for queries and mutations
3. Utilize query keys for effective caching
4. Use prefetching for improved performance
5. Implement proper error and loading states

## Project Structure

```
src/
  components/      # React components
  hooks/           # Custom hooks
    useQueries/    # Query hooks
    useMutations/  # Mutation hooks
  pages/           # Page components
  utils/           # Utility functions
  api/             # API request wrappers
```

## Additional Instructions

1. Implement proper error boundaries for query errors
2. Use stale-while-revalidate strategy for data freshness
3. Implement optimistic updates for mutations
4. Use query invalidation for data refetching
5. Follow React Query naming conventions for consistency


