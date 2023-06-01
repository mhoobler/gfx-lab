import { FC, StrictMode, useContext, useEffect } from "react";
import { WgpuContext } from "./wgpu";
import { NodeBoard, NodeProvider } from "components";

import "./style.less";

const App: FC = () => {
  const { device, format } = useContext(WgpuContext);

  useEffect(() => {
    //import("json_layouts/hello_triangle.json")
    //  .then((data) => console.log(data.default))
    //  .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {device && format && (
        <StrictMode>
          <NodeProvider device={device} format={format}>
            <NodeBoard />
          </NodeProvider>
        </StrictMode>
      )}
    </div>
  );
};

export default App;
