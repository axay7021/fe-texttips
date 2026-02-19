---
trigger: always_on
---

# Project Rules & Guidelines (`gemini.md`)

This file establishes the coding standards, architectural patterns, and best practices for the **Rewriter** project. All developers and AI agents must follow these guidelines to ensure code quality, consistency, and maintainability.

---

## 1. Project Overview & Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Authentication**: `better-auth` (inferred from `auth-client.ts` / `auth.ts`)
- **Payments**: Stripe
- **Styling**: Tailwind CSS / CSS Modules
- **Package Manager**: pnpm

---

## 2. General Coding Standards

### 2.1 Typescript & Type Safety
- **Strict Typing**: Avoid `any` whenever possible. Use explicit interfaces or types for all data structures, especially API responses and Mongoose models.
- **Interfaces vs Types**: Prefer `interface` for object definitions that might be extended, and `type` for unions/primitives.
- **No Implicit Any**: Ensure all function parameters and return types are typed.

### 2.2 Naming Conventions
- **Files**: `kebab-case.ts` (e.g., `user-service.ts`, `plan.model.ts`).
- **Classes**: `PascalCase` (e.g., `SubscriptionService`).
- **Variables/Functions**: `camelCase` (e.g., `getUserSubscription`, `isValid`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`, `STRIPE_WEBHOOK_SECRET`).
- **Directories**: `kebab-case`.

### 2.3 Code Structure
- **Colocation**: Keep related files close. Functions used only by a specific component should be near it or in a purely local `utils.ts` if complex.
- **Modular Imports**: Use `@/` alias for imports (e.g., `import { stripe } from "@/lib/stripe"`).
- **Exports**: Prefer named exports over default exports for better tree-shaking and refactoring support (except for Next.js Pages/Routes which require default exports).

---

## 3. Backend & API Rules (`app/api`)

### 3.1 Route Handlers
- **Validation**: Validate all incoming request bodies and query parameters using Zod (see `lib/zod.ts` usually, or define inline schemas).
- **Error Handling**: Use `try/catch` blocks. Return standardized error responses (status codes 400, 401, 403, 404, 500) with clear messages.
- **Statelessness**: APIs should be stateless. Rely on session tokens/headers for auth.

### 3.2 Database Access (Mongoose)
- **Connection**: Ensure `dbConnect()` is called at the start of every API route handler (imported from `lib/mongodb`).
- **Models**: Define models in `app/models/`. Use `lean()` for read-only operations to improve performance.
- **Environment**: Do not hardcode DB URIs; strictly use `process.env.MONGODB_URI`.

### 3.3 Stripe Integration
- **Webhooks**: Always verify the Stripe signature (`Stripe-Signature`). Handle `checkout.session.completed` and `invoice.payment_succeeded` at minimum.
- **Idempotency**: Ensure webhook handlers are idempotent (can run multiple times without side effects).
- **Metadata**: Use metadata in Stripe objects (Sessions, Subscriptions) to link Stripe data back to internal user IDs (`userId`, `planId`).

---

## 4. Frontend Guidelines

- **Server Components**: Use React Server Components (RSC) by default. Use `"use client"` only when interactivity (hooks, event listeners) is needed.
- **Suspense & Loading**: Use `Suspense` boundaries for data fetching to show loading states.

---

## 5. Security Best Practices

- **Secrets**: Never commit `.env` files. Access secrets only via `process.env`.
- **Validation**: Never trust client input. Sanitize and validate on the server.
- **Auth**: Protect private routes using the session check (`auth.api.getSession`).

---

## 6. Git & Workflow

- **Commits**: Use conventional commits (e.g., `feat: add subscription model`, `fix: stripe webhook signature`).
- **Clean Code**: Remove `console.log` (except for critical error logging) and commented-out code before committing.
