import React, { useReducer } from "react";
import { createContext, FC } from "react";
import nodeReducer from "./reducer";
import NodeManager from "./NodeManager";

const NodeContext = createContext({
  state: null,
  dispatch: (() => {}) as React.Dispatch<any>, // eslint-disable-line
});
const { Provider } = NodeContext;

type Props = {children: React.ReactNode, device: GPUDevice, format: GPUTextureFormat };
const NodeProvider: FC<Props> = ({ device, children, format }) => {
  const [state, dispatch] = useReducer(nodeReducer, new NodeManager(device, format));

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { NodeContext, NodeProvider };
