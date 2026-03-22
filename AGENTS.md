# AGENTS.md - Vaquitapp Developer Guide

This document provides guidelines for AI agents working on the Vaquitapp codebase.

## Project Overview

Vaquitapp is a Next.js 15 application (App Router) that accepts donations via MercadoPago. It uses PostgreSQL (Neon), Sequelize ORM, TypeScript, and SCSS modules.

## Build Commands

```bash
# Development - runs on port 4004 with Turbopack
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Type checking (via tsc)
npx tsc --noEmit
```

There are currently no tests in this project. If tests are added in the future:
- Run a single test: `pnpm test <path-to-test>`
- Run all tests: `pnpm test`

## Code Style Guidelines

### General Rules

- Use **TypeScript** for all new code
- Strict mode is currently disabled in tsconfig.json (`strict: false`) - do not enable it without coordination
- Use functional components with arrow functions or function declarations
- Avoid comments unless explaining complex business logic
- Keep functions small and focused

### Imports

- Use path aliases with `@/` prefix (e.g., `@/lib/db/PostgreAPI`)
- Order: React/Next imports, external libraries, internal modules
- Group imports logically

```typescript
// Good
import { createSingleProductPreference } from "@/lib/mercadopago";
import { createPurchase } from "@/lib/purchases";
import { redirect } from "next/navigation";

// Good - SCSS modules
import styles from "./form.module.scss";
```

### Naming Conventions

- **Components**: PascalCase (e.g., `DonationForm`, `SuccessPage`)
- **Functions/variables**: camelCase (e.g., `getConfirmedPayments`, `newPurchInput`)
- **Files**: camelCase for utilities, kebab-case for components
- **Types/interfaces**: PascalCase with `type` keyword

```typescript
// Type definitions
type Purchase = {
  id: string;
  from: string;
  amount: number;
};

type CreatePrefOptions = {
  productName: string;
  productPrice: number;
};
```

### Server vs Client Components

- Use `"use client"` for components with interactivity, hooks, or browser APIs
- Use `"use server"` for Server Actions
- Prefer Server Components by default; only use client when needed

```typescript
// Client component
"use client";
export function DonationForm() { ... }

// Server Action
"use server";
export async function donateAction(data: FormData) { ... }
```

### SCSS Styling

- Use SCSS modules with `.module.scss` naming pattern
- Co-locate styles with components in same directory
- Use meaningful class names that describe purpose, not appearance

```typescript
// Import co-located module
import styles from "./form.module.scss";

// Usage
<form className={styles.form}>
  <input className={styles.textField} />
</form>
```

### Error Handling

- Throw descriptive errors with context
- Log errors appropriately with `console.error`
- Handle async operations with try/catch for expected errors

```typescript
// Good - descriptive error
async updatePurchase(id, updateData) {
  const purchase = await Purchase.findByPk(id);
  if (!purchase) throw new Error("Purchase not found");
  return await purchase.update(updateData);
}

// Database connection error logging
sequelize.authenticate().catch((e) => {
  console.error("Unable to connect to the database:", e);
});
```

### Type Annotations

- Explicitly type function parameters and return types
- Use `any` sparingly - prefer explicit types
- Use `Pick<T, K>` for partial type definitions

```typescript
// Good - explicit return type
export async function getConfirmedPayments(): Promise<Purchase[]> { ... }

// Using Pick for partial types
export async function createPurchase(
  newPurchInput: Pick<Purchase, "from" | "amount" | "message">
): Promise<string> { ... }
```

### Environment Variables

Required environment variables (document in .env.example):
- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `MERCADOPAGO_ACCESS_TOKEN` - MercadoPago access token
- `VERCEL_URL` - Vercel deployment URL (optional, defaults to localhost:4004)

Never commit secrets to repository. Use `.env.local` for local development.

### Database Patterns

- Use Sequelize models in `src/lib/db/model.ts`
- Use repository pattern (e.g., `PostgreAPI` class) for database operations
- Initialize DB connection at module level

```typescript
// Model definition
export const Purchase = sequelize.define("Purchase", {
  state: { type: DataTypes.STRING, allowNull: false, defaultValue: "pending" },
  from: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
});
```

### API Routes

- Place API routes in `src/app/api/` directory
- Use Next.js App Router conventions (route.ts files)
- Handle errors and return appropriate status codes

### Best Practices

- Keep business logic in `src/lib/` (not in components)
- Use Server Actions for form submissions
- Validate user input in server actions before processing
- Use TypeScript enums for fixed sets of values
- Avoid premature abstraction - create patterns first, then refactor
- Test thoroughly before deploying payment-related changes