# 🤖 Agent Development Guidelines

This document defines the core principles and guidelines for the Gemini AI agent when developing this project.

## 1. Architecture: Server-First

- **Default to Server Components:** All components should be authored as **Server Components** by default.
- **Opt-in to Client Components:** Only use the `'use client';` directive to convert a component to a **Client Component** when absolutely necessary. This includes cases requiring client-side hooks like `useState`, `useEffect`, `usePathname`, or event handlers like `onClick`.
- **Keep Client Components Small:** Client Components should be as small and isolated as possible. Instead of making an entire page or layout a Client Component, extract the interactive parts (e.g., a button, a navigation menu) into their own dedicated Client Components.

## 2. Code Style

- **Consistency:** Maintain a consistent code style and conventions throughout the project.
- **Modern Syntax:** Actively use modern ES6+ and TypeScript syntax, but prioritize readability.
- **Reusability:** Encapsulate reusable UI and logic into separate components or utility functions to promote reusability.
- **Import Order:** Follow a strict import order, grouped and separated by newlines:
  1.  React & Next.js framework modules (`react`, `next/*`)
  2.  External libraries (e.g., `lucide-react`, `mermaid`)
  3.  Internal modules & components (e.g., `@/components/*`, `@/lib/*`)
- **Adhere to Prettier:** All code must be formatted according to the `.prettierrc` configuration file before finalizing any changes.

## 3. Version Control

- **Meaningful Commits:** Write clear and descriptive commit messages that explain the changes (e.g., "feat: Add active link styling to header").
- **Atomic Commits:** Group related changes into a single, atomic commit.

## 4. Task Management

- **Reference `DEVELOPMENT.md`:** Always refer to the `DEVELOPMENT.md` file for the project's feature roadmap and to-do list.
- **Update Task Status:** After completing a task, update the corresponding checkbox in `DEVELOPMENT.md` to reflect the progress (e.g., from `[ ]` to `[x]`).
