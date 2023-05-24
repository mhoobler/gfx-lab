import React, { useCallback, useMemo, useReducer } from "react";
import { createContext, FC } from "react";
//import nodeReducer from "./reducer";
import NodeManager, { initManagerWithJunk, render2 } from "./NodeManager";
import { NodeContextState, NodeData } from "../../data";
import {
  createConnection,
  getAllConnections,
  getAllNodes,
  removeConnection,
} from "../../node_utils";

const NodeContext = createContext({
  state: {
    nodes: [],
    connections: [],
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
  const nm = useMemo(() => {
    let manager = new NodeManager(device, format);
    initManagerWithJunk(manager, device, format);
    return manager;
  }, [device, format]);

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

        case "LINK_SENDER_NODE": {
          let { sender, receiverId } = payload;
          createConnection(nm, sender, receiverId);

          return {
            nodes: state.nodes,
            connections: getAllConnections(nm),
          };
        }

        case "LINK_MULTIPLE_NODES": {
          for (let link of payload) {
            let { sender, receiverId } = link;
            createConnection(nm, sender, receiverId);
          }

          return {
            nodes: state.nodes,
            connections: getAllConnections(nm),
          };
        }

        case "DELETE_CONNECTION": {
          let { receiverType, receiverId } = payload;
          removeConnection(nm, receiverId, receiverType);

          return {
            nodes: state.nodes,
            connections: getAllConnections(nm),
          };
        }

        case "RENDER": {
          render2(nm);
          
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
    connections: getAllConnections(nm),
  });

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { NodeContext, NodeProvider };
