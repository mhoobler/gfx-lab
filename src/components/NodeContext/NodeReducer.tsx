import {
  createConnection,
  finalizeConnection,
  getAllConnections2,
  getAllNodes,
  removeConnection,
  updateConnections,
  NodeManager,
  loadJson,
  saveJson,
} from "./NodeManager";

const NodeReducer =
  // TODO: iron out reducer action-types
  // eslint-disable-next-line
  (nm: NodeManager) => (state: NodeContextState, action: any) => {
    // TODO: Svg State Management
    const { type, payload } = action;

    switch (type) {
      case "ADD_RECEIVER": {
        const { index, receiver } = payload;

        let node = nm.nodes[receiver.uuid];
        node.receivers[receiver.type][index] = receiver;

        return {
          ...state,
          connections: getAllConnections2(nm),
        };
      }

      case "EDIT_NODE_BODY": {
        const { uuid, body } = payload;
        nm.nodes[uuid].body = body;
        updateConnections(nm, nm.nodes[uuid]);

        return {
          ...state,
          nodes: getAllNodes(nm),
          connections: getAllConnections2(nm),
        };
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

      case "REFRESH_CONNECTIONS": {
        return state;
      }

      case "CLEAR": {
        nm.nodes = {};
        nm.connections = new Map();
        const selectedLayout = { url: "", name: "Clear" };

        return {
          ...state,
          nodes: getAllNodes(nm),
          connections: getAllConnections2(nm),
          selectedLayout,
        };
      }
      case "LOAD_LAYOUT": {
        nm.nodes = {};
        nm.connections = new Map();
        loadJson(nm, payload.data.nodes);

        const selectedLayout = { url: payload.url, name: payload.data.name };

        return {
          ...state,
          nodes: getAllNodes(nm),
          connections: getAllConnections2(nm),
          selectedLayout,
        };
      }

      case "RENDER": {
        return {
          ...state,
          renderState: !state.renderState,
        };
      }

      default: {
        console.error(`nodeReducer default case`, action);
        return state;
      }
    }
  };

export default NodeReducer;
