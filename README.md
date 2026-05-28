# PTC Campus Rewards Frontend (MVP Foundation)

Mobile-first Next.js App Router frontend for a school rewards wallet. Uses typed mocks today; connects to FastAPI via `src/lib/api.ts`.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- Shared UI primitives (`DataTable`, `StatCard`, `AsyncBoundary`, `FormField`, …)
- Role routes: `/student`, `/staff`, `/vendor`, `/admin`

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API layer (`src/lib/api.ts`)

Import the API from a single module:

```ts
import { api, apiFetch, isMockApi } from "@/lib/api";
```

| Env variable | Purpose |
|--------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | FastAPI base URL (e.g. `http://localhost:8000`) |
| `NEXT_PUBLIC_USE_MOCK_API=false` | Force HTTP even when base URL is unset |

When no base URL is set, `api.*` uses the in-memory mock store (`src/lib/mock-store.ts`).

`api-client.ts` re-exports `api` for backward compatibility — prefer `@/lib/api`.

### Methods (stable for FastAPI swap)

- `getStudents()`, `getWallets()`, `getTransactions()`
- `getRewardRules()`, `getRewardItems()`, `getEarningRules()`, `getIssuedRewards()`
- `issueReward(input)`, `redeemReward(input)`, `simulateWalletScan()`
- `getVendorDailySummary()`, `getAdminRedemptions()`, `getAuditLogs()`, `getAdminReports()`
- Student: `getStudentWallet()`, `getStudentProfile()`, `getStudentStats()`, `getStudentCatalog()`, `getStudentActivityTimeline()`, `getTransactionsByUserId()`

## Architecture

### Routes

| Path | Role |
|------|------|
| `/student/wallet` | Main wallet |
| `/student/transactions` | Activity |
| `/student/rewards` | Catalog |
| `/student/profile` | Profile |
| `/staff/rewards` | Issue credits |
| `/vendor/scanner` | Redeem at vendor |
| `/admin/*` | Admin overview, students, rules, redemptions, reports, audit |

### Shared components (`src/components/shared/`)

- `DataTable` — responsive tables with empty states
- `StatCard` / `StatGrid` — metric tiles
- `PageHeader`, `AsyncBoundary`, `CategoryPills`, `KeyValueList`, `FormField`
- `Card`, `Button`, `LoadingState`, `EmptyState`, `ErrorState`

### Layout

- `AppShell` — unified header + optional nav (used by student + ops routes)
- `StudentWalletProvider` — single fetch shared across student pages

### Hooks

- `useAsyncQuery` — loading/error/refresh for admin/staff/vendor pages
- `useStudentWallet` — student bundle (via context on `/student/*`)

## Connect FastAPI

1. Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`
2. Implement matching routes on the backend (see `httpApi` in `api.ts`)
3. Add auth headers in `apiFetch` when OAuth is ready
