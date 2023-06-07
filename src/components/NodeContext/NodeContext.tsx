import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { createContext, FC } from "react";
import { NodeManager, render, getAllConnections2, getAllNodes } from "./NodeManager";
import NodeReducer from "./NodeReducer";

const NodeContext = createContext({
  state: {
    renderState: false,
    nodes: [],
    connections: [],
    selectedLayout: { url: "", name: "hello_vertex.json" },
  },
  dispatch: (async () => {}) as React.Dispatch<any>,
});
const { Provider } = NodeContext;

type Props = {
  children: React.ReactNode;
  device: GPUDevice;
  format: GPUTextureFormat;
};
const NodeProvider: FC<Props> = ({ device, children, format }) => {
  const nm = useMemo(() => {
    const manager = new NodeManager(device, format);
    return manager;
  }, [device, format]);

  const nodeReducer = useCallback(NodeReducer(nm), [nm]);

  const [state, dispatch] = useReducer(nodeReducer, {
    renderState: false,
    nodes: getAllNodes(nm),
    connections: getAllConnections2(nm),
    selectedLayout: { url: "", name: "hello_vertex.json" },
  });

  const renderLoop = () => {
    render(nm);
    renderLoopRef.current = requestAnimationFrame(renderLoop);
  };

  const renderLoopRef = useRef(null);
  useEffect(() => {
    if (state.renderState) {
      renderLoopRef.current = requestAnimationFrame(renderLoop);
    }

    return () => cancelAnimationFrame(renderLoopRef.current);
  }, [state.renderState]);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { NodeContext, NodeProvider };
