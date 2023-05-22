import React, { useCallback, useMemo, useReducer } from "react";
import { createContext, FC } from "react";
//import nodeReducer from "./reducer";
import NodeManager, { getAllNodes } from "./NodeManager";
import { NodeContextState } from "../../data";

const NodeContext = createContext({
  state: {
    nodes: [],
  },
  dispatch: (() => {}) as React.Dispatch<any>, // eslint-disable-line
});
const { Provider } = NodeContext;

type Props = {
  children: React.ReactNode;
  device: GPUDevice;
  format: GPUTextureFormat;
};
const NodeProvider: FC<Props> = ({ device, children, format }) => {
  const nm = useMemo(() => new NodeManager(device, format), [device, format]);

  const nodeReducer = useCallback(
    (state: NodeContextState, action: any) => {
      // eslint-disable-line
      // TODO: Svg State Management
      const { type, payload } = action;

      switch (type) {
        case "MOVE_NODE": {
          const { data, x, y } = payload;
          data.xyz[0] = x;
          data.xyz[1] = y;
          data.xyz[2] += 1;

          return state;
        }
        // TODO:
        case "LINK_NODE": {
          console.log("LN");

          return state;
        }
        default: {
          console.error(`nodeReducer default case`, action);
          return state;
        }
      }
    },
    [nm]
  );

  const [state, dispatch] = useReducer(nodeReducer, {
    nodes: getAllNodes(nm),
  });

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { NodeContext, NodeProvider };
