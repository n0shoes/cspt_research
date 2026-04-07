import { Classic } from "@caido/primevue";
import PrimeVue from "primevue/config";
import { createApp } from "vue";

import App from "./views/App.vue";
import "./styles/index.css";
import { SDKPlugin } from "./plugins/sdk";
import type { FrontendSDK } from "./types";

export const init = (sdk: FrontendSDK) => {
  const app = createApp(App);

  app.use(PrimeVue, {
    unstyled: true,
    pt: Classic,
  });

  app.use(SDKPlugin, sdk);

  const root = document.createElement("div");
  Object.assign(root.style, {
    height: "100%",
    width: "100%",
  });
  root.id = "plugin--cspt-analyzer";

  app.mount(root);

  sdk.navigation.addPage("/cspt-analyzer", {
    body: root,
  });

  sdk.sidebar.registerItem("CSPT Analyzer", "/cspt-analyzer");
};
