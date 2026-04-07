# React CSPT Lab

Client-Side Path Traversal research lab for React Router v7 + Vite.

## Setup

```bash
bun install
```

## Run

```bash
# Production (minified JS + sourcemaps)
bun run build && bun run preview

# Development (unminified, HMR)
bun run dev
```

Dev runs on `http://localhost:5173`, preview on `http://localhost:4173`.

## Routes

### Dynamic Segments

| Route | Pattern | Risk |
|-------|---------|------|
| `/users/:userId` | `useParams()` → fetch template literal | Medium |
| `/shop/:category/:productId` | `useParams()` → fetch string concat | Medium |
| `/teams/:teamId/members/:memberId` | `useParams()` → nested dynamic (axios) | Medium |

### Catch-All / Splat

| Route | Pattern | Risk |
|-------|---------|------|
| `/files/*` | `useParams()["*"]` → fetch with splat | **HIGH** |

### Query / Hash Sinks

| Route | Pattern | Risk |
|-------|---------|------|
| `/dashboard/stats` | `useSearchParams()` → fetch → `dangerouslySetInnerHTML` | **CRITICAL** |
| `/dashboard/settings` | `useParams()` → service layer → fetch | Medium |
| `/dashboard` | `useSearchParams("redirect")` → `navigate()` | Medium (open redirect) |

### Other Patterns

| Route | Pattern | Risk |
|-------|---------|------|
| `/:lang?/categories` | `useSearchParams()` → fetch with filter | Medium |
| `/data/:dataId` | Route loader → fetch | Medium |
| `/lazy` | `React.lazy()` + React Query → fetch | Medium |

### Encoding Diagnostics

| Route | Purpose |
|-------|---------|
| `/encoding-test/:testParam` | Client encoding comparison |
| `/encoding-splat/*` | Splat route encoding test |

## Key Difference from Next.js

React Router v7 decodes params once and hands them to `useParams()` as-is. There is no re-encoding step. This means `..%2F` in the URL becomes `../` in `useParams()` — direct CSPT via path params is possible, unlike Next.js client components which re-encode.
