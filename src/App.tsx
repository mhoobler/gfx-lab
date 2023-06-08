import { FC, StrictMode, useContext } from "react";
import { WgpuContext } from "./wgpu";
import { NodeBoard, NodeProvider } from "components";

import "./style.less";

const App: FC = () => {
  const { device, format } = useContext(WgpuContext);

  return (
    <div>
      {device && format && (
        <NodeProvider device={device} format={format}>
          <StrictMode>
            <NodeBoard />
          </StrictMode>
        </NodeProvider>
      )}
    </div>
  );
};

export default App;
