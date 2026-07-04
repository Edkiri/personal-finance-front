# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Type-check (vue-tsc) then build for production
npm run preview    # Preview the production build
npm run lint:fix   # ESLint autofix across .js/.ts/.vue
```

There is no test runner configured. `npm run build` doubles as the type-check gate (`vue-tsc && vite build`), so run it to validate type correctness.

`VITE_API_BASE_URL` (see `.env.example`, defaults to `http://localhost:3000`) points at the backend API this SPA consumes.

## Stack

Vue 3 (`<script setup>`, Composition API) + TypeScript, Vite, Pinia for state, Vue Router, Tailwind (class-based dark mode), Axios. Path aliases are defined in both `vite.config.ts` and `tsconfig.json` — keep them in sync: `@` → `src`, `@app`, `@core`, `@layout`, `@hooks`, `@utils`, `@assets`.

## Architecture

### Feature-module layout (`src/app/<feature>/`)
Each domain feature (`accounts`, `auth`, `debts`, `expense-sources`, `expenses`, `incomes`, `users`) follows the same internal structure:
- `types.d.ts` — domain types. Convention: `CreateXDto` / `UpdateXPayload` for request shapes, `XWithId` for server responses.
- `hooks/` — one composable per API operation (`useCreateExpense`, `useUpdateExpense`, `useDeleteExpense`, …). Each wraps `useAxios` and exposes an async action plus `loading`/`error`.
- `stores/` — a Pinia store (setup-style `defineStore`) holding the feature's client state and read/list actions.
- `views/` — route-level page components.
- `components/` — feature-specific forms and lists.

Shared building blocks live outside `app/`: `src/core/` (reusable `C*`-prefixed UI primitives, barrel-exported via `@core`), `src/layout/` (navbar/header), `src/hooks/` (generic composables), `src/utils/`, `src/store/` (global stores).

### Data flow
All HTTP goes through `src/hooks/useAxios.ts`. It creates a single `AxiosClient` whose request interceptor injects `Authorization: Bearer <accessToken>` from the app store. `fetchApi<T>({ method, path, payload })` returns the Axios response or `undefined` on error, tracking `loading`/`status`/`error` refs. For GET requests, `payload` is run through `buildQueryParams` (strips empty arrays and falsy values) and sent as query params; for POST/PUT/DELETE it's the body. Non-Axios errors auto-push an error toast; HTTP errors only set `status` (callers decide how to surface them). Dates are `.toISOString()`-serialized at the hook boundary before sending.

### Global state (`src/store/`)
- `app-store.ts` (`useAppStore`) — the app's root store: theme, `accessToken` (persisted via `useLocalStorage`), current `user`, and an idempotent `init()` that loads the user profile on boot if a token exists. `main.ts` calls `appStore.init()` before mounting.
- `toast-store.ts` (`useToastStore`) — toast queue, capped at 5, auto-dismissing after 4s.

### Routing & auth (`src/router/`)
- `routes.ts` — central `ROUTES` path constants (import these rather than hardcoding paths).
- `router.ts` — route table with lazy-imported components and `meta: { requiresAuth, requiresOnboarding }`. A global `beforeEach` guard redirects unauthenticated users away from protected routes to `LOGIN`, and un-onboarded users to `ONBOARDING`.

## Conventions
- ESLint = airbnb-base + vue3-essential + typescript-recommended + Prettier; Prettier violations are lint errors. `tsconfig` is strict with `noUnusedLocals`/`noUnusedParameters` on.
- Core UI components are prefixed `C` (e.g. `CButton`, `CModal`, `CDateInput`) and imported from `@core`.
- SVGs in `src/assets/` are imported as Vue components via `vite-svg-loader`.
