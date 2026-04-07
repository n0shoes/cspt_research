# 6. Appendix

## A: React Router Source Line References

| Function | File | Lines | Purpose |
|----------|------|-------|---------|
| `parsePath()` | router.js | 309-327 | Split URL into path/search/hash (no decode) |
| `createBrowserLocation()` | router.js | 170-183 | Read from window.location |
| `matchRoutesImpl()` | router.js | 523-543 | Orchestrates matching, calls decodePath at 539 |
| `decodePath()` | router.js | 863-870 | Per-segment decodeURIComponent, re-encodes / |
| `compilePath()` | router.js | 822-861 | Builds regex: `:param`=[^\\/]+, `*`=(.*) |
| `matchPath()` | router.js | 782-821 | Extracts params, **line 811: %2F→/** |
| `matchRouteBranch()` | router.js | 693-736 | Iterates route segments |
| `useParams()` | react-router.js | 237-243 | Returns match.params (decoded) |
| `useSearchParams()` | react-router-dom.js | 1068-1085 | Wraps URLSearchParams (auto-decodes) |
| Re-encoding | react-router.js | 353-360 | Re-encodes pathname via new URL() but NOT params |

## B: Lab App Structure

```
react-cspt-lab/
  src/
    App.tsx              - createBrowserRouter with all 12 route types
    pages/
      UserPage.tsx       - useParams → fetch (template literal)
      ProductPage.tsx    - useParams → fetch (concatenation)
      CategoriesPage.tsx - useSearchParams → fetch
      FilesPage.tsx      - splat param → fetch
      MemberPage.tsx     - useParams → axios.get
      DashboardStats.tsx - searchParams → fetch → dangerouslySetInnerHTML
      DashboardSettings.tsx - API service layer pattern
      DataPage.tsx       - route loader → fetch
      LazyPage.tsx       - TanStack Query with dynamic URL
      DashboardIndex.tsx - navigate() open redirect
      EncodingTestPage.tsx - encoding experiment (named param)
      EncodingSplatPage.tsx - encoding experiment (splat param)
  dist/
    assets/
      index-DeP1TdBi.js     - 349 kB main bundle
      LazyPage-CWMNrFw5.js  - 8.9 kB lazy chunk
```
