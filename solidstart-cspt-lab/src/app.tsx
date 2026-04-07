import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

export default function App() {
  return (
    <Router
      root={(props) => (
        <main>
          <h1>SolidStart CSPT Lab</h1>
          <nav>
            <a href="/">Home</a> | <a href="/about">About</a> |{" "}
            <a href="/users/123">User 123</a> |{" "}
            <a href="/shop/electronics/456">Product</a> |{" "}
            <a href="/files/docs/readme.txt">File</a> |{" "}
            <a href="/teams/t1/members/m1">Team Member</a> |{" "}
            <a href="/dashboard">Dashboard</a> |{" "}
            <a href="/data/abc">Data</a> |{" "}
            <a href="/encoding-test/hello%2fworld">Encoding Test</a> |{" "}
            <a href="/encoding-catchall/a/b/c">Catchall</a>
          </nav>
          <Suspense>{props.children}</Suspense>
        </main>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
