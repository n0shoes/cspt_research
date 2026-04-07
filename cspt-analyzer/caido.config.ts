import { defineConfig } from "@caido-community/dev";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "tailwindcss";
// @ts-expect-error no declared types at this time
import tailwindCaido from "@caido/tailwindcss";
import path from "path";
import prefixwrap from "postcss-prefixwrap";
import tailwindPrimeui from "tailwindcss-primeui";

const id = "cspt-analyzer";
export default defineConfig({
  id,
  name: "CSPT Analyzer",
  description:
    "Passive framework detection with client-side path extraction and CSPT sink analysis",
  version: "1.0.0",
  author: {
    name: "xssdoctor",
    email: "xssdoctor@proton.me",
    url: "https://github.com/xssdoctor",
  },
  plugins: [
    {
      kind: "backend",
      id: "cspt-backend",
      root: "packages/backend",
    },
    {
      kind: "frontend",
      id: "cspt-frontend",
      root: "packages/frontend",
      backend: {
        id: "cspt-backend",
      },
      vite: {
        plugins: [vue()],
        build: {
          rollupOptions: {
            external: ["@caido/frontend-sdk"],
          },
        },
        resolve: {
          alias: [
            {
              find: "@",
              replacement: path.resolve(__dirname, "packages/frontend/src"),
            },
          ],
        },
        css: {
          postcss: {
            plugins: [
              prefixwrap(`#plugin--${id}`),
              tailwindcss({
                corePlugins: {
                  preflight: false,
                },
                content: [
                  "./packages/frontend/src/**/*.{vue,ts}",
                  "./node_modules/@caido/primevue/dist/primevue.mjs",
                ],
                darkMode: ["selector", '[data-mode="dark"]'],
                plugins: [tailwindPrimeui, tailwindCaido],
              }),
            ],
          },
        },
      },
    },
  ],
});
