
# Court Reporter

A web application for book and document processing with enhanced reading capabilities.

## Error Handling Guidelines

This project uses a centralized error handling approach to ensure consistent error management across the codebase.

### Key Error Handling Principles

1. **Use the error handling utilities**:
   - `handleError`: For logging and user notification
   - `safeOperation`: For wrapping async operations with error handling
   - `executeWithTiming`: For operations where timing metrics are important

2. **Error propagation**:
   - Lower-level functions should throw errors for higher-level functions to handle
   - User-facing components should catch errors and provide appropriate feedback

3. **Error structure**:
   - Use the `AppError` interface for consistent error formatting
   - Include error codes for easier debugging and tracking

### Example Usage

```typescript
// Basic error handling
try {
  await someOperation();
} catch (error) {
  handleError(error, 'Operation context');
}

// Safe operation wrapper
const result = await safeOperation(
  () => someAsyncFunction(),
  'Operation name',
  'Friendly error message'
);

// With timing
const timed = await executeWithTiming(
  () => complexOperation(),
  'Complex operation'
);
```

## Code Duplication Prevention

To prevent code duplication, follow these guidelines:

1. **Use shared utilities**:
   - Check if a utility function already exists before creating a new one
   - Consider making specific functions more generic if they could be reused

2. **Component composition**:
   - Create small, focused components that can be composed together
   - Avoid copying component logic; instead, make components more flexible with props

3. **Centralized business logic**:
   - Keep business logic in hooks and utilities, not in components
   - Use context providers for shared state rather than duplicating state logic

## Getting Started

(Instructions for setting up and running the project)

## Contributing

(Guidelines for contributing to the project)
