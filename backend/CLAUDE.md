# CLAUDE.md - Backend

Backend-specific guidelines for the Child Development Tracker Express.js API.

## Module System

This project uses **ESM (ECMAScript Modules)** with `"type": "module"` in package.json.
- Use `import`/`export` syntax instead of `require()`/`module.exports`
- Always include `.js` file extensions in import statements
- Use `import.meta.url` and `fileURLToPath()` for `__dirname` replacement

## Express.js Specific Guidelines

### Route Structure
- Use RESTful naming conventions
- Group related routes in separate router files
- Use consistent HTTP status codes

### Controller Functions
- Keep controllers thin - business logic should be in services
- Use async/await instead of callbacks
- Always handle errors properly
- Return consistent response format

### Error Handling
- Use centralized error handling middleware
- Create custom error classes for different error types
- Always call next(error) in async route handlers

### Middleware Organization
- Place middleware in logical order
- Create reusable middleware functions
- Use descriptive names for custom middleware