import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { WgpuProvider } from "./wgpu";

const container = document.getElementById("app");
createRoot(container).render(
  <WgpuProvider>
    <App />
  </WgpuProvider>
);
