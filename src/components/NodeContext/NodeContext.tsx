import React, { useCallback, useMemo, useReducer } from "react";
import { createContext, FC } from "react";
//import nodeReducer from "./reducer";
import NodeManager, { initManagerWithJunk, render2 } from "./NodeManager";
import { NodeContextState } from "../../data";
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
  // TODO: iron out reducer action-types
  // eslint-disable-next-line 
  dispatch: (() => {}) as React.Dispatch<any>,
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
    initManagerWithJunk(manager);
    return manager;
  }, [device, format]);

  const nodeReducer = useCallback(
    // TODO: iron out reducer action-types
    // eslint-disable-next-line 
    (state: NodeContextState, action: any) => {
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
          const { sender, receiverId } = payload;
          createConnection(nm, sender, receiverId);

          return {
            nodes: state.nodes,
            connections: getAllConnections(nm),
          };
        }

        case "LINK_MULTIPLE_NODES": {
          for (const link of payload) {
            const { sender, receiverId } = link;
            createConnection(nm, sender, receiverId);
          }

          return {
            nodes: state.nodes,
            connections: getAllConnections(nm),
          };
        }

        case "DELETE_CONNECTION": {
          const { receiverType, receiverId } = payload;
          removeConnection(nm, receiverId, receiverType);

          return {
            nodes: state.nodes,
            connections: getAllConnections(nm),
          };
        }

        case "ADD_DRAW_CALL": {
          const {uuid, receiver} = payload;
          const index = state.nodes.findIndex(e => e.uuid === uuid);
          const node = {...state.nodes[index]};

          if (node.receivers.includes(receiver)) {
            return state;
          }

          node.receivers.push(receiver);
          state.nodes[index] = node;

          return {
            nodes: getAllNodes(nm),
            connections: state.connections
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