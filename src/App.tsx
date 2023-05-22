import React, { useContext } from "react";
import { WgpuContext } from "./wgpu";
import { NodeBoard, NodeProvider } from "./components";

const App: React.FC = () => {
  const { device, format } = useContext(WgpuContext);

  return (
    <div>
      { device && format &&
      <NodeProvider device={device} format={format}>
        <NodeBoard />
      </NodeProvider>
      }
    </div>
  );
};

export default App;
