import React, { useCallback, useMemo, useReducer } from "react";
import { createContext, FC } from "react";
import NodeManager, { loadJson, render } from "./NodeManager";
import {
  createConnection,
  finalizeConnection,
  getAllConnections2,
  getAllNodes,
  removeConnection,
  updateConnections,
} from "node_utils";

type NodeContextState = {
  nodes: NodeData<unknown>[];
  connections: NodeConnection[];
  selectedLayout: { url: string; name: string };
};

const NodeContext = createContext({
  state: {
    nodes: [],
    connections: [],
    selectedLayout: { url: "", name: "hello_vertex.json" },
  },
  // TODO: iron out reducer action-types
  // eslint-disable-next-line
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
    //initManagerWithJunk(manager);
    return manager;
  }, [device, format]);

  const nodeReducer = useCallback(
    // TODO: iron out reducer action-types
    // eslint-disable-next-line
    (state: NodeContextState, action: any) => {
      // TODO: Svg State Management
      const { type, payload } = action;

      switch (type) {
        case "EDIT_NODE_BODY": {
          console.log("EDIT");
          const { uuid, body } = payload;
          nm.nodes[uuid].body = body;
          updateConnections(nm, nm.nodes[uuid]);

          return state;
        }
        case "MOVE_NODE": {
          const { data, x, y } = payload;
          data.xyz[0] = x;
          data.xyz[1] = y;
          data.xyz[2] += 1;

          return state;
        }

        case "LINK_SENDER_NODE": {
          const { sender, receiverId, receiverIndex } = payload;
          const senderNode = nm.nodes[sender.uuid];
          const receiverNode = nm.nodes[receiverId];
          createConnection(nm, sender, receiverId, receiverIndex);
          finalizeConnection(nm, senderNode, receiverNode);

          return {
            ...state,
            connections: getAllConnections2(nm),
          };
        }

        case "DELETE_CONNECTION": {
          const { senderId, receiverId } = payload;
          removeConnection(nm, { receiverId, senderId });

          return {
            ...state,
            connections: getAllConnections2(nm),
          };
        }

        case "ADD_DRAW_CALL": {
          const { uuid, receiver } = payload;
          const index = state.nodes.findIndex((e) => e.uuid === uuid);
          const node = { ...state.nodes[index] };

          if (node.receivers.includes(receiver)) {
            return state;
          }

          node.receivers.push(receiver);
          state.nodes[index] = node;

          return {
            ...state,
            nodes: getAllNodes(nm),
          };
        }

        case "REFRESH_CONNECTIONS": {
          return state;
        }

        case "CLEAR": {
          nm.nodes = {};
          nm.connections = new Map();
          const selectedLayout = { url: "", name: "Clear" };

          return {
            nodes: getAllNodes(nm),
            connections: getAllConnections2(nm),
            selectedLayout,
          };
        }
        case "LOAD_LAYOUT": {
          nm.nodes = {};
          nm.connections = new Map();
          loadJson(nm, payload.data.nodes);

          const selectedLayout = { url: "", name: payload.data.name };

          return {
            nodes: getAllNodes(nm),
            connections: getAllConnections2(nm),
            selectedLayout,
          };
        }

        case "RENDER": {
          render(nm);

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
    connections: getAllConnections2(nm),
    selectedLayout: { url: "", name: "hello_vertex.json" },
  });

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { NodeContext, NodeProvider };
