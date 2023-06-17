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
  createNode,
} from "./NodeManager";
import { Node } from "data";

const NodeReducer =
  (nm: NodeManager) =>
  // TODO: iron out reducer action-types
  // eslint-disable-next-line
  (state: Node.ContextState, action: any): Node.ContextState => {
    // TODO: Svg State Management
    const { type, payload } = action;

    switch (type) {
      case "ADD_RENDERPASS_STEP": {
        const { index, receiver, body } = payload;

        const node = nm.nodes[receiver.uuid];
        node.receivers[receiver.type][index] = receiver;
        node.body = body;

        return {
          ...state,
          nodes: getAllNodes(nm),
        };
      }

      case "ADD_RECEIVER": {
        const { index, receiver } = payload;

        const node = nm.nodes[receiver.uuid];
        node.receivers[receiver.type][index] = receiver;

        return {
          ...state,
          connections: getAllConnections2(nm),
        };
      }

      case "CREATE_NODE": {
        const { type, xyz } = payload;
        createNode(nm, type, xyz);

        return {
          ...state,
          nodes: getAllNodes(nm),
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

      case "DELETE_RECEIVER": {
        const { uuid, type, index } = payload;
        const node = nm.nodes[uuid];
        const receiver = node.receivers[type][index];
        
        removeConnection(nm, {
          receiverId: uuid,
          senderId: receiver.from.uuid
        });
        node.receivers[type] = node.receivers[type].filter((_, i) => i !== index);

        return {
          ...state,
          nodes: getAllNodes(nm),
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
        const { name, zoom, nodes, position } = payload.data;
        loadJson(nm, nodes);

        const selectedLayout = { url: payload.url, name: name };

        const viewBox = [
          ...position,
          window.innerWidth * zoom,
          window.innerHeight * zoom,
        ];

        return {
          zoom,
          viewBox,
          renderState: false,
          nodes: getAllNodes(nm),
          connections: getAllConnections2(nm),
          selectedLayout,
        };
      }

      case "SAVE_LAYOUT": {
        const position = [state.viewBox[0], state.viewBox[1]];
        const zoom = state.zoom;
        saveJson(nm, zoom, position);
        return state;
      }

      case "RENDER": {
        return {
          ...state,
          renderState: !state.renderState,
        };
      }

      case "PAN_ZOOM": {
        const { zoom, viewBox } = payload;
        return {
          ...state,
          zoom,
          viewBox,
        };
      }

      default: {
        console.error(`nodeReducer default case`, action);
        return state;
      }
    }
  };

export default NodeReducer;
