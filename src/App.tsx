import React, { useContext } from "react";
import { WgpuContext } from "./wgpu";
import { NodeBoard, NodeProvider } from "./components";

import "./style.less";

const App: React.FC = () => {
  const { device, format } = useContext(WgpuContext);

  return (
    <div>
      {device && format && (
        <React.StrictMode>
          <NodeProvider device={device} format={format}>
            <NodeBoard />
          </NodeProvider>
        </React.StrictMode>
      )}
    </div>
  );
};

export default App;
