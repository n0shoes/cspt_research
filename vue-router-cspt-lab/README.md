# Vue Router CSPT Lab

Client-Side Path Traversal research lab demonstrating Vue Router v4's encoding differential — the core primitive behind CSPT in Vue/Nuxt applications.

## Quick Start

```bash
bun install
bun run dev
```

The lab runs on `http://localhost:5173` by default.

## What This Demonstrates

Vue Router decodes `route.params` and `route.query` via `decodeURIComponent()` before your code sees them, while `route.path` and `route.fullPath` preserve encoding. This encoding split is the foundational CSPT primitive:

| Source | Encoding | CSPT Risk |
|--------|----------|-----------|
| `route.params.*` | **DECODED** (`%2F` → `/`) | Dangerous — traversal possible |
| `route.query.*` | **DECODED** | Dangerous — especially with `v-html` sinks |
| `route.path` | Encoded (`%2F` stays `%2F`) | Safe for fetch URLs |
| `route.fullPath` | Encoded | Safe for fetch URLs |
| `window.location.hash` | Literal (no encoding/decoding) | Dangerous — raw `../` passes through |

## Lab Routes

### Dangerous Sources (decoded → fetch sink)

| Route | Source | Traversal URL |
|-------|--------|---------------|
| `/users/:userId` | `route.params.userId` | `/users/..%2F..%2Fadmin` |
| `/files/:pathMatch(.*)*` | Catch-all array (decoded segments) | `/files/..%2F..%2Fadmin%2Fsecrets` |
| `/dashboard/stats` | `route.query.widget` | `/dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious` |
| `/dashboard/settings` | `location.hash` | `/dashboard/settings#../../admin/users` |
| `/docs/:chapters+` | Repeatable param (decoded) | `/docs/..%2F..%2Fadmin` |
| `/shop/:category/:productId` | Multi-param concat | `/shop/..%2F..%2Fadmin/anything` |
| `/teams/:teamId/members/:memberId` | Nested params (Axios) | `/teams/..%2F..%2Fadmin/members/1` |

### Safe Sources (encoding preserved)

| Route | Source | Test URL |
|-------|--------|----------|
| `/encoding-test/:testParam` | `route.path` / `route.fullPath` | `/encoding-test/hello%2Fworld` |
| `/encoding-catchall/:pathMatch(.*)*` | Catch-all encoding diagnostic | `/encoding-catchall/a%2Fb/c` |

### Other Routes

- `/about` — Static page
- `/dashboard` — Layout with nested children (`/dashboard/stats`, `/dashboard/settings`)
- `/:lang?/categories` — Optional param

## Stack

- Vue 3 + TypeScript
- Vue Router 4 (`createWebHistory`)
- Vite 7
- TanStack Vue Query
- Axios
