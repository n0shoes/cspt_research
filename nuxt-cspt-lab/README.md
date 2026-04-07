# Nuxt 3 CSPT Lab

A research lab for exploring Client-Side Path Traversal (CSPT) vulnerabilities in Nuxt 3 / Vue Router 4.

## Install & Run

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What This Demonstrates

Nuxt inherits Vue Router's decoding behavior — `useRoute().params` and `useRoute().query` return **decoded** values (`%2F` becomes `/`), while `useRoute().path` and `useRoute().fullPath` preserve encoding.

This creates a dual attack surface:

- **Client-side CSPT** — decoded params flow into `useFetch`/`$fetch`, allowing path traversal
- **Server-side SSRF** — `getRouterParam()` in Nitro server routes also decodes
- **CSPT-to-XSS** — decoded query params combined with `v-html` enable XSS chains

## Lab Pages

| Route | Pattern |
|-------|---------|
| `/users/[id]` | `params.id` → `useFetch` |
| `/files/[...slug]` | Catch-all array → joined into fetch path |
| `/dashboard/stats?widget=x` | Query param → `useFetch` → `v-html` (XSS) |
| `/dashboard/settings#path` | `location.hash` → fetch via composable |
| `/data/[dataId]` | SSR/CSR param → `useFetch` |
| `/shop/[category]/[productId]` | Multi-param concatenation → `$fetch` |
| `/encoding-test/[testParam]` | Side-by-side encoding comparison |
| `/encoding-catchall/[...slug]` | Catch-all array decoding behavior |
