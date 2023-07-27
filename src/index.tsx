import { createRoot } from "react-dom/client";

import App from "./App";
import { GPUProvider } from "contexts";
import { StrictMode } from "react";

async function main() {
  try {
    if (!navigator.gpu) {
      throw new Error("WebGPU not supported");
    }
    const format = navigator.gpu.getPreferredCanvasFormat();
    const adapter = await navigator.gpu.requestAdapter({
      powerPreference: "high-performance",
    });
    const device = await adapter.requestDevice();

    createRoot(document.getElementById("app")).render(
      <StrictMode>
        <GPUProvider format={format} adapter={adapter} device={device}>
          <App />
        </GPUProvider>
      </StrictMode>
    );
  } catch (err) {
    console.error(err);
  }
}

main();
