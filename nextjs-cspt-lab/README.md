# Next.js CSPT Lab

Client-Side Path Traversal research lab for Next.js App Router (v15).

## Setup

```bash
bun install
```

## Run

```bash
# Production (minified JS + sourcemaps)
bun run build && bun run start

# Development (unminified, HMR)
bun run dev
```

Runs on `http://localhost:3000`.

## Routes

### Client Components (useParams → re-encoded)

| Route | Pattern | Risk |
|-------|---------|------|
| `/users/[userId]` | `useParams()` → fetch template literal | Low |
| `/shop/[category]/[productId]` | `useParams()` → fetch string concat | Low |
| `/teams/[teamId]/members/[memberId]` | `useParams()` → nested dynamic params | Low |

### Server Components (await params → decoded)

| Route | Pattern | Risk |
|-------|---------|------|
| `/files/[...path]` | catch-all → server fetch | **HIGH (SSRF)** |
| `/docs/[[...slug]]` | optional catch-all → server fetch | **HIGH (SSRF)** |
| `/data/[dataId]` | single param → server fetch | **HIGH (SSRF)** |

### Client Sinks (searchParams / hash)

| Route | Pattern | Risk |
|-------|---------|------|
| `/dashboard/stats` | `useSearchParams()` → fetch → `dangerouslySetInnerHTML` | **CRITICAL** |
| `/dashboard/settings` | `window.location.hash` → service layer → fetch | **HIGH** |
| `/dashboard` | `useSearchParams()` → `router.push()` | Medium (open redirect) |

### Route Handler

| Route | Pattern | Risk |
|-------|---------|------|
| `/api/proxy/[...path]` | catch-all params → server fetch | **HIGH (SSRF)** |

### Encoding Diagnostics

| Route | Purpose |
|-------|---------|
| `/encoding-test/[testParam]` | Client-side encoding comparison |
| `/encoding-catchall/[...segments]` | Server-side catch-all decoding |

## Test Payloads

```bash
# Server-side SSRF (decoded params)
curl http://localhost:3000/files/..%2F..%2Fetc/passwd
curl http://localhost:3000/data/..%2F..%2Finternal
curl http://localhost:3000/api/proxy/..%2F..%2Finternal/admin

# Client-side CSPT
# /dashboard/stats?widget=../../attachments/malicious
# /dashboard/settings#../../admin/users

# Encoding diagnostics
curl http://localhost:3000/encoding-catchall/%2E%2E%2Fapi%2Fadmin
# /encoding-test/..%2Fapi%2Fadmin (open in browser)
```

## Key Finding

Next.js re-encodes params for client components (`useParams()` returns `..%2F` not `../`), making client-side CSPT via path params harder than React Router. Server components receive decoded values — the real attack surface is server-side.
