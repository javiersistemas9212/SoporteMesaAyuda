# CLAUDE.md

## Project Overview

This project is a React-based web application used to manage information related to a technical support team.

The application provides multiple CRUD modules for managing support operations, team members, clients, tickets, service requests, reports, and related entities.

The main objective is to create a maintainable, scalable, and enterprise-grade frontend application.

---

# Tech Stack

## Core Technologies

* React
* TypeScript
* Vite
* React Router
* Axios

## State Management

* TanStack Query for server state
* React Context for lightweight global state

## Forms

* React Hook Form
* Zod for validation

## UI Components

* Material UI

---

# Architecture Principles

Always follow these principles:

1. Separation of concerns
2. Reusable components
3. Strong typing
4. Feature-based organization
5. Clean and maintainable code
6. Avoid duplicated logic
7. Keep components small and focused

---

# Project Structure

src/

├── app/
├── routes/
├── layouts/
├── features/
├── components/
├── hooks/
├── services/
├── contexts/
├── types/
├── utils/
├── constants/
└── assets/

Each business module must be placed inside the features folder.

Example:

features/

├── users/
├── teams/
├── assignments/
├── tickets/
├── reports/
├── mocks/

---

# CRUD Standards

Every CRUD module should contain:

* List of items at the bottom of the page, with a grid featuring options to view, edit, and delete.
* Create and Edit on the same page in a large floating window
* Details Page (if required)
* Service Layer
* Types
* Validation Schema

Example:

features/clients/

├── pages/
├── components/
├── services/
├── hooks/
├── schemas/
└── types/

---

# Naming Conventions

## Components

PascalCase

Examples:

UserForm.tsx
UserTable.tsx
TeamDetails.tsx

## Hooks

Prefix with use

Examples:

useUsers.ts
useTeams.ts

## Services

Suffix with Service

Examples:

userService.ts
teamService.ts

## Types

Use descriptive names

Examples:

User
CreateUserRequest
UpdateUserRequest

---

# API Integration

Always use Axios.

Do not use fetch.

API communication must be isolated inside service files.

Bad:

Calling APIs directly inside components.

Good:

Component
→ Hook
→ Service
→ API

---

# Forms

Always use:

* React Hook Form
* Zod validation

Validation rules must be extracted into dedicated schema files.

Avoid large forms in a single component.

Split complex forms into reusable sections.

---

# Tables

Use Material UI DataGrid whenever possible.

Tables should support:

* Pagination
* Sorting
* Filtering
* Loading state
* Empty state

---

# Error Handling

Always handle:

* Loading state
* Empty state
* Error state

Display user-friendly messages.

Never expose raw API errors to users.

---

# TypeScript Rules

Strict typing is required.

Avoid:

* any
* unknown abuse
* unnecessary type assertions

Always create interfaces or types for API responses.

---

# Code Quality Rules

Generate production-ready code.

Avoid code duplication.

Prefer composition over inheritance.

Extract reusable logic into custom hooks.

Keep components under 300 lines whenever possible.

Split large components into smaller reusable pieces.

---

# Accessibility

Use semantic HTML.

All forms must include labels.

Buttons must have meaningful text.

---

# Security

Never hardcode secrets.

Never hardcode API URLs.

Use environment variables.

Validate user input before submission.

---

# When Generating Code

Always:

1. Use TypeScript.
2. Create reusable components.
3. Create service files.
4. Create validation schemas.
5. Follow project structure.
6. Follow CRUD standards.
7. Generate maintainable code.
8. Generate enterprise-level React code.
9. Include loading and error handling.
10. Keep business logic outside UI components.

The generated code should be suitable for a long-term enterprise application.
