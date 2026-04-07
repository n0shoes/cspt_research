import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AboutPage from "./pages/AboutPage";
import UserPage from "./pages/UserPage";
import CategoriesPage from "./pages/CategoriesPage";
import FilesPage from "./pages/FilesPage";
import MemberPage from "./pages/MemberPage";
import ProductPage from "./pages/ProductPage";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardIndex from "./pages/DashboardIndex";
import DashboardStats from "./pages/DashboardStats";
import DashboardSettings from "./pages/DashboardSettings";
import DataPage, { dataLoader } from "./pages/DataPage";
import EncodingTestPage from "./pages/EncodingTestPage";
import EncodingSplatPage from "./pages/EncodingSplatPage";

const LazyPage = React.lazy(() => import("./pages/LazyPage"));

const queryClient = new QueryClient();

const HomeElement = (
  <div
    style={{
      padding: "2rem",
      fontFamily: "monospace",
      maxWidth: "900px",
      margin: "0 auto",
    }}
  >
    <h1>React Router CSPT Lab</h1>
    <p style={{ color: "#888", marginBottom: "1rem" }}>
      Client-Side Path Traversal research lab — React Router v7 (Vite SPA)
    </p>

    {/* Key Finding */}
    <div
      style={{
        padding: "1rem",
        background: "#111",
        borderRadius: 8,
        marginBottom: "2rem",
        border: "1px solid #333",
      }}
    >
      <h3 style={{ margin: "0 0 0.5rem", color: "#f90" }}>
        Key Finding: React Router is a CSPT Vending Machine
      </h3>
      <p style={{ margin: 0, color: "#ccc", lineHeight: 1.6 }}>
        <code>useParams()</code> in React Router calls{" "}
        <span style={{ color: "#f44" }}>decodeURIComponent()</span> on{" "}
        <strong>every</strong> path param — %2F always becomes /. This is the
        opposite of Next.js App Router (which re-encodes).
        <br />
        <code>useParams()["*"]</code> (splat) is{" "}
        <span style={{ color: "#f44" }}>CRITICAL</span> — captures literal
        slashes with no encoding, so ../ traversal works without any encoding at
        all.
        <br />
        <code>useSearchParams()</code> and{" "}
        <code>window.location.hash</code> also decode before JavaScript sees
        them.
        <br />
        <strong>
          The only safe source is <code>useLocation().pathname</code> which
          preserves %2F.
        </strong>
      </p>
    </div>

    {/* DANGEROUS SOURCES */}
    <div
      style={{
        padding: "1rem",
        background: "#1a0000",
        borderRadius: 8,
        marginBottom: "2rem",
        border: "1px solid #f44",
      }}
    >
      <h2 style={{ margin: "0 0 0.75rem", color: "#f44" }}>
        DANGEROUS SOURCES (decode %2F to /)
      </h2>

      <p style={{ color: "#888", fontSize: "0.85rem", margin: "0 0 0.75rem" }}>
        These sources return a decoded value — %2F becomes / before JavaScript
        sees it. Combined with a fetch sink, path traversal is possible.
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                color: "#888",
                fontWeight: "normal",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid #333",
                fontSize: "0.8rem",
              }}
            >
              Source
            </th>
            <th
              style={{
                textAlign: "left",
                color: "#888",
                fontWeight: "normal",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid #333",
                fontSize: "0.8rem",
              }}
            >
              Demo
            </th>
            <th
              style={{
                textAlign: "left",
                color: "#888",
                fontWeight: "normal",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid #333",
                fontSize: "0.8rem",
              }}
            >
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "0.5rem 0", color: "#f44" }}>
              <code>useParams()</code>
              <br />
              <span style={{ fontSize: "0.75rem", color: "#888" }}>
                all path params
              </span>
            </td>
            <td style={{ padding: "0.5rem 0.5rem" }}>
              <a
                href="/users/..%2Fapi%2Fsecret"
                style={{ color: "#f44" }}
              >
                /users/..%2Fapi%2Fsecret
              </a>
            </td>
            <td
              style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
            >
              useParams → fetch — %2F decoded to / before JS sees it
            </td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem 0", color: "#f44" }}>
              <code>useParams()["*"]</code>
              <br />
              <span style={{ fontSize: "0.75rem", color: "#888" }}>
                splat / catch-all
              </span>
            </td>
            <td style={{ padding: "0.5rem 0.5rem" }}>
              <a
                href="/files/..%2F..%2Finternal%2Fsecrets"
                style={{ color: "#f44" }}
              >
                /files/..%2F..%2Finternal%2Fsecrets
              </a>
            </td>
            <td
              style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
            >
              CRITICAL — splat captures literal slashes too, no encoding needed
            </td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem 0", color: "#f44" }}>
              <code>useSearchParams()</code>
            </td>
            <td style={{ padding: "0.5rem 0.5rem" }}>
              <a
                href="/dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious"
                style={{ color: "#f44" }}
              >
                /dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious
              </a>
            </td>
            <td
              style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
            >
              CSPT + dangerouslySetInnerHTML → XSS chain
            </td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem 0", color: "#f44" }}>
              <code>location.hash</code>
            </td>
            <td style={{ padding: "0.5rem 0.5rem" }}>
              <a
                href="/dashboard/settings#../../admin/users"
                style={{ color: "#f44" }}
              >
                /dashboard/settings#../../admin/users
              </a>
            </td>
            <td
              style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
            >
              Literal ../ in hash, flows through service layer → fetch
            </td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem 0", color: "#f44" }}>
              <code>loader({"{ params }"})</code>
              <br />
              <span style={{ fontSize: "0.75rem", color: "#888" }}>
                data router loader
              </span>
            </td>
            <td style={{ padding: "0.5rem 0.5rem" }}>
              <a
                href="/data/..%2F..%2Finternal"
                style={{ color: "#f44" }}
              >
                /data/..%2F..%2Finternal
              </a>
            </td>
            <td
              style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
            >
              Loader params decoded same as useParams — runs before render
            </td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem 0", color: "#f44" }}>
              <code>useSearchParams()</code>
              <br />
              <span style={{ fontSize: "0.75rem", color: "#888" }}>
                open redirect
              </span>
            </td>
            <td style={{ padding: "0.5rem 0.5rem" }}>
              <a
                href="/dashboard?redirect=..%2F..%2Fabout"
                style={{ color: "#f44" }}
              >
                /dashboard?redirect=..%2F..%2Fabout
              </a>
            </td>
            <td
              style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
            >
              searchParam → navigate() — open redirect sink
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* SAFE SOURCES */}
    <div
      style={{
        padding: "1rem",
        background: "#001a00",
        borderRadius: 8,
        marginBottom: "2rem",
        border: "1px solid #4a4",
      }}
    >
      <h2 style={{ margin: "0 0 0.75rem", color: "#4a4" }}>
        SAFE SOURCES (preserve %2F encoding)
      </h2>

      <p style={{ color: "#888", fontSize: "0.85rem", margin: "0 0 0.75rem" }}>
        These sources preserve %2F — the value you get in JavaScript still
        contains %2F, so it cannot cross path boundaries when used in a fetch
        URL.
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                color: "#888",
                fontWeight: "normal",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid #333",
                fontSize: "0.8rem",
              }}
            >
              Source
            </th>
            <th
              style={{
                textAlign: "left",
                color: "#888",
                fontWeight: "normal",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid #333",
                fontSize: "0.8rem",
              }}
            >
              Demo
            </th>
            <th
              style={{
                textAlign: "left",
                color: "#888",
                fontWeight: "normal",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid #333",
                fontSize: "0.8rem",
              }}
            >
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "0.5rem 0", color: "#4a4" }}>
              <code>useLocation().pathname</code>
            </td>
            <td style={{ padding: "0.5rem 0.5rem" }}>
              <a href="/encoding-test/test%2Fpath" style={{ color: "#4a4" }}>
                /encoding-test/test%2Fpath
              </a>
            </td>
            <td
              style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
            >
              location.pathname preserves %2F — safe to use directly in fetch
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* Encoding Diagnostics */}
    <h2 style={{ color: "#ccc" }}>Encoding Diagnostics</h2>
    <ul style={{ lineHeight: "2.2" }}>
      <li>
        <a
          href="/encoding-test/hello%2Fworld"
          style={{ fontWeight: "bold" }}
        >
          /encoding-test/:testParam
        </a>
        <code
          style={{
            marginLeft: 8,
            fontSize: "0.8rem",
            color: "#f44",
            fontWeight: "bold",
          }}
        >
          useParams vs location.pathname encoding comparison
        </code>
      </li>
      <li>
        <a href="/encoding-splat/a%2Fb/c">
          /encoding-splat/*
        </a>
        <code
          style={{ marginLeft: 8, fontSize: "0.8rem", color: "#f44" }}
        >
          CRITICAL — splat route encoding: literal slashes + %2F decoded
        </code>
      </li>
    </ul>

    <h2 style={{ color: "#ccc" }}>All Routes</h2>
    <ul style={{ lineHeight: "2.2" }}>
      <li>
        <a href="/users/..%2Fapi%2Fsecret" style={{ color: "#f44" }}>
          /users/:userId
        </a>
        <code
          style={{ marginLeft: 8, fontSize: "0.8rem", color: "#888" }}
        >
          useParams() → fetch (DANGEROUS)
        </code>
      </li>
      <li>
        <a href="/files/..%2F..%2Finternal%2Fsecrets" style={{ color: "#f44" }}>
          /files/*
        </a>
        <code
          style={{ marginLeft: 8, fontSize: "0.8rem", color: "#888" }}
        >
          useParams()["*"] → fetch (CRITICAL)
        </code>
      </li>
      <li>
        <a href="/shop/electronics%2Fhacked/99" style={{ color: "#f44" }}>
          /shop/:category/:productId
        </a>
        <code
          style={{ marginLeft: 8, fontSize: "0.8rem", color: "#888" }}
        >
          multi-param useParams() → fetch (DANGEROUS)
        </code>
      </li>
      <li>
        <a href="/teams/1%2F2/members/42" style={{ color: "#f44" }}>
          /teams/:teamId/members/:memberId
        </a>
        <code
          style={{ marginLeft: 8, fontSize: "0.8rem", color: "#888" }}
        >
          nested params → axios (DANGEROUS)
        </code>
      </li>
      <li>
        <a
          href="/dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious"
          style={{ color: "#f44" }}
        >
          /dashboard/stats
        </a>
        <code
          style={{ marginLeft: 8, fontSize: "0.8rem", color: "#888" }}
        >
          useSearchParams() → fetch → dangerouslySetInnerHTML (CRITICAL)
        </code>
      </li>
      <li>
        <a href="/dashboard/settings#../../admin/users" style={{ color: "#f44" }}>
          /dashboard/settings
        </a>
        <code
          style={{ marginLeft: 8, fontSize: "0.8rem", color: "#888" }}
        >
          location.hash → service layer → fetch (DANGEROUS)
        </code>
      </li>
      <li>
        <a href="/dashboard?redirect=..%2F..%2Fabout" style={{ color: "#f44" }}>
          /dashboard
        </a>
        <code
          style={{ marginLeft: 8, fontSize: "0.8rem", color: "#888" }}
        >
          searchParams → navigate() open redirect (DANGEROUS)
        </code>
      </li>
      <li>
        <a href="/data/..%2F..%2Finternal" style={{ color: "#f44" }}>
          /data/:dataId
        </a>
        <code
          style={{ marginLeft: 8, fontSize: "0.8rem", color: "#888" }}
        >
          loader params → fetch (DANGEROUS)
        </code>
      </li>
      <li>
        <a href="/about">/about</a>
        <code
          style={{ marginLeft: 8, fontSize: "0.8rem", color: "#888" }}
        >
          static page with client fetch
        </code>
      </li>
    </ul>
  </div>
);

const router = createBrowserRouter([
  // Home / index
  {
    path: "/",
    element: HomeElement,
  },

  // Static route
  { path: "/about", element: <AboutPage /> },

  // Dynamic segment
  { path: "/users/:userId", element: <UserPage /> },

  // Optional segment
  { path: "/:lang?/categories", element: <CategoriesPage /> },

  // Catch-all / splat
  { path: "/files/*", element: <FilesPage /> },

  // Nested dynamic
  { path: "/teams/:teamId/members/:memberId", element: <MemberPage /> },

  // Multiple params
  { path: "/shop/:category/:productId", element: <ProductPage /> },

  // Layout route with nested children
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      // Index route
      { index: true, element: <DashboardIndex /> },
      { path: "stats", element: <DashboardStats /> },
      { path: "settings", element: <DashboardSettings /> },
    ],
  },

  // Lazy-loaded route
  {
    path: "/lazy",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LazyPage />
      </Suspense>
    ),
  },

  // Loader route with params
  {
    path: "/data/:dataId",
    loader: dataLoader,
    element: <DataPage />,
  },

  // Encoding test routes
  { path: "/encoding-test/:testParam", element: <EncodingTestPage /> },
  { path: "/encoding-splat/*", element: <EncodingSplatPage /> },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
