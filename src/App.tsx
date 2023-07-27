import { FC, StrictMode } from "react";
import { SVGNodeBoard } from "components";
import { NodeProvider } from "contexts";
import { Node } from "data";
//import { NodeBoard2, NodeProvider2 } from "components";
//import { GFXNodeBoard, GFXNodeProvider } from "components";

import "./style.less";

const initState: Node.State = {
  nodes: {
    a: Node.init("a", [300, 0], "VertexState"),
    b: Node.init("b", [0, 0], "VertexBufferLayout"),
  },
  connections: [],
  senderValues: {},
  device: null,
};


const App: FC = () => {

  return (
    <StrictMode>
      <NodeProvider initState={initState}>
        <SVGNodeBoard/>
      </NodeProvider>
    </StrictMode>
  );
};

export default App;
