# React CSPT Deep Dive: Empirical Analysis

> Empirical validation of Client-Side Path Traversal in React Router v7.
> Built a real app, compiled it, tested encodings in-browser, read the source code.

## Files

| File | Description |
|------|-------------|
| [01-route-definitions.md](01-route-definitions.md) | All client-side path definition methods, what survives minification, detection regexes |
| [02-source-to-sink.md](02-source-to-sink.md) | Dynamic params → fetch chains, all CSPT sources and sinks |
| [03-encoding-behavior.md](03-encoding-behavior.md) | Decoding pipeline, empirical test results, end-to-end CSPT proof |
| [04-encoding-matrix.md](04-encoding-matrix.md) | Comprehensive encoding matrix: overlong UTF-8, Unicode, zero-width, BiDi, combining chars, decision tree |
| [05-caido-patterns.md](05-caido-patterns.md) | Updated regex patterns for Caido plugin: extraction, sinks, framework detection |
| [06-appendix.md](06-appendix.md) | React Router source line references, lab app structure |

## Key Takeaways

1. **`useParams()` returns DECODED values** — `%2F` → `/`, `%2E` → `.` — this is the CSPT primitive
2. **Double-decode in path params** — `%252F` → `%2F` (decodeURIComponent) → `/` (line 811 replace)
3. **Query params only single-decode** — `%252F` stays as `%2F` in `searchParams.get()`
4. **Overlong UTF-8 and Unicode homoglyphs do NOT work** — `decodeURIComponent` rejects invalid UTF-8, no NFKC normalization
5. **`useLocation().pathname` is safe** — preserves encoding, but almost nobody uses it for API calls
6. **Route path strings survive minification verbatim** — all `:param`, `*`, `?` markers preserved
7. **Hook names get mangled** — `useParams` → 2-letter identifier, but the source-to-sink pattern is detectable

## Lab App

The test app is at `../react-cspt-lab/` — a React Router v7 app with 12 route types and CSPT-vulnerable patterns in every component.
