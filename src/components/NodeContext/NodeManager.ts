import { NodeInitFn } from "components";
import { NodeBodyForJson } from "components/panels";
import { CommandEncoderData } from "components/panels/CommandEncoderPanel/CommandEncoderPanel";
import { DrawCallData } from "components/panels/DrawCallPanel/DrawCallPanel";
import { NODE_TYPE_PRIORITY, Node } from "data";

const lut = [];
for (let i = 0; i < 256; i++) {
  lut[i] = (i < 16 ? "0" : "") + i.toString(16);
}

// https://stackoverflow.com/a/21963136/10606203
function uuid() {
  const d0 = (Math.random() * 0xffffffff) | 0;
  const d1 = (Math.random() * 0xffffffff) | 0;
  const d2 = (Math.random() * 0xffffffff) | 0;
  const d3 = (Math.random() * 0xffffffff) | 0;
  return (
    lut[d0 & 0xff] +
    lut[(d0 >> 8) & 0xff] +
    lut[(d0 >> 16) & 0xff] +
    lut[(d0 >> 24) & 0xff] +
    "-" +
    lut[d1 & 0xff] +
    lut[(d1 >> 8) & 0xff] +
    "-" +
    lut[((d1 >> 16) & 0x0f) | 0x40] +
    lut[(d1 >> 24) & 0xff] +
    "-" +
    lut[(d2 & 0x3f) | 0x80] +
    lut[(d2 >> 8) & 0xff] +
    "-" +
    lut[(d2 >> 16) & 0xff] +
    lut[(d2 >> 24) & 0xff] +
    lut[d3 & 0xff] +
    lut[(d3 >> 8) & 0xff] +
    lut[(d3 >> 16) & 0xff] +
    lut[(d3 >> 24) & 0xff]
  );
}

type NodeDefault = Node.Data<GPUBase, Node.Receivers | null>;
type ByCategory = { [Property in keyof Node.Type]: Set<string> };
type ConnectionMap = Map<NodeDefault, Map<NodeDefault, number>>;
export class NodeManager {
  device: GPUDevice;
  format: GPUTextureFormat;
  nodes: {
    [key: string]: NodeDefault;
  };
  connections: ConnectionMap;
  byCategory: ByCategory;

  constructor(device: GPUDevice, format: GPUTextureFormat) {
    this.device = device;
    this.format = format;
    this.connections = new Map();

    this.nodes = {};
    this.byCategory = {} as ByCategory;
  }
}

export function loadJson(
  manager: NodeManager,
  json: { [key: string]: Node.Json }
) {
  manager.nodes = {};
  manager.byCategory = {} as ByCategory;
  manager.connections = new Map();

  for (const nodeJson of Object.values(json)) {
    const { uuid, type, xyz, size, body } = nodeJson;
    if (!manager.nodes[uuid] && NodeInitFn[type]) {
      const newNode = NodeInitFn[type](uuid, xyz);
      addNode(manager, newNode);

      if (body) {
        newNode.body = { ...newNode.body, ...body };
        if (type === "Data") {
          const b = newNode.body as GPUData;
          b.data = new Float32Array(
            b.text
              .split(",")
              .map((n) => parseFloat(n))
              .filter((e) => !isNaN(e))
          );
        }
      }
      if (size) {
        newNode.size = size;
      }
    }
  }

  // TODO: Need to implement a method to sort with "connection priority"
  // Check broken_connection.json vs. hello_vertex.json
  const orderedNodes = NODE_TYPE_PRIORITY.flatMap((nodeType) => [
    ...manager.byCategory[nodeType],
  ]).map((uuid) => manager.nodes[uuid]);

  for (const node of orderedNodes) {
    const { connections } = json[node.uuid];
    if (connections) {
      for (const { uuid, receiverIndex } of connections) {
        while (
          manager.nodes[uuid].receivers[node.type].length <= receiverIndex
        ) {
          manager.nodes[uuid].receivers[node.type].push({
            uuid,
            type: node.type,
            from: null,
          });
        }
        createConnection(manager, node.sender, uuid, receiverIndex);
      }
    }
  }
}

export function saveJson(manager: NodeManager) {
  const orderedNodes = NODE_TYPE_PRIORITY.flatMap((nodeType) => [
    ...manager.byCategory[nodeType],
  ]).map((uuid) => manager.nodes[uuid]);

  for (const nodeType of NODE_TYPE_PRIORITY) {
    const uuids = manager.byCategory[nodeType];
    for (const uuid of uuids) {
      orderedNodes.push(manager.nodes[uuid]);
    }
  }

  const json = {
    name: "Test Save",
    nodes: {},
  };
  for (const senderNode of orderedNodes) {
    const { uuid, xyz, type, body, sender } = senderNode;

    const getReceiverIndex = (receiverNode: NodeDefault): number => {
      return receiverNode.receivers[type].findIndex(
        (receiver: Node.Receiver) => receiver.from === senderNode
      );
    }

    const connections = [...sender.to].map((receiverNode) => {
      const receiverIndex = getReceiverIndex(receiverNode);
      return { uuid: receiverNode.uuid, receiverIndex };
    });

    const nodeJson = {
      uuid,
      xyz,
      type,
      body: NodeBodyForJson[type](body as any),
      connections,
    };
    json.nodes[uuid] = nodeJson;
  }

  const dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
  const dlAnchorElem = document.createElement("a");
  const root = document.querySelector("#app");
  root.appendChild(dlAnchorElem);
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "scene.json");
  dlAnchorElem.click();
  root.removeChild(dlAnchorElem);
}

export function addNode<T extends NodeDefault>(
  manager: NodeManager,
  node: T
): string {
  if (!manager.byCategory[node.type]) {
    manager.byCategory[node.type] = new Set();
  }
  manager.byCategory[node.type].add(node.uuid);

  manager.nodes[node.uuid] = node;
  return node.uuid;
}

export function render(manager: NodeManager) {
  for (const cID of manager.byCategory["CommandEncoder"]) {
    const command = manager.nodes[cID] as CommandEncoderData;

    if (command.body.renderPassDesc) {
      command.body.renderPassDesc.colorAttachments[0].view =
        command.body.renderPassDesc.canvasPointer.createView();

      const encoder = manager.device.createCommandEncoder(command.body);
      const pass = encoder.beginRenderPass(command.body.renderPassDesc);

      const lim = command.receivers["DrawCall"].length;
      for (let i = 0; i < lim; i++) {
        const drawCall = command.receivers["DrawCall"][i].from as DrawCallData;

        if (drawCall) {
          if (drawCall.body.renderPipeline) {
            pass.setPipeline(drawCall.body.renderPipeline);
          }
          if (drawCall.body.buffer) {
            pass.setVertexBuffer(0, drawCall.body.buffer);
          }
          pass.draw(drawCall.body.vertexCount);
        }
      }
      pass.end();

      const commandBuffer = encoder.finish();
      manager.device.queue.submit([commandBuffer]);
    }
  }
}

export function getAllNodes(manager: NodeManager) {
  const arr = [...Object.values(manager.nodes)].sort(
    (a, b) => a.xyz[2] - b.xyz[2]
  );

  arr.forEach((node: NodeDefault, i: number) => {
    node.xyz[2] = i;
  });
  return arr;
}

function getNodeConnection(
  senderNode: NodeDefault,
  receiverNode: NodeDefault,
  receiverIndex: number
): Node.Connection {
  const receiverXYZ: [n, n, n] = [...receiverNode.xyz];
  receiverXYZ[0] += 8;
  receiverXYZ[1] += 30 + 30 * receiverIndex;

  const senderXYZ: [n, n, n] = [...senderNode.xyz];
  senderXYZ[0] += senderNode.size[0];
  senderXYZ[1] += 30;

  return {
    sender: {
      uuid: senderNode.uuid,
      xyz: senderXYZ,
    },
    receiver: {
      type: senderNode.type,
      uuid: receiverNode.uuid,
      index: receiverIndex,
      xyz: receiverXYZ,
    },
  };
}

export function getAllConnections2(manager: NodeManager): Node.Connection[] {
  const connections = [];

  for (const [senderNode, innerMap] of manager.connections.entries()) {
    for (const [receiverNode, receiverIndex] of innerMap.entries()) {
      connections.push(
        getNodeConnection(senderNode, receiverNode, receiverIndex)
      );
    }
  }

  return connections;
}

export function removeConnection(
  manager: NodeManager,
  ids: {
    receiverId: string;
    senderId: string;
  }
) {
  const { senderId, receiverId } = ids;
  const senderNode = manager.nodes[senderId];
  if (!senderNode) {
    throw new Error(`Could not find senderNode with uuid: ${receiverId}`);
  }

  const receiverNode = manager.nodes[receiverId];
  if (!receiverNode) {
    throw new Error(`Could not find receiverNode with uuid: ${receiverId}`);
  }

  const innerMap = manager.connections.get(senderNode);
  const receiverIndex = innerMap.get(receiverNode);
  if (receiverIndex >= 0) {
    receiverNode.receivers[senderNode.type][receiverIndex].from = null;
    senderNode.sender.to.delete(receiverNode);
    innerMap.delete(receiverNode);
    finalizeConnection(manager, senderNode, receiverNode, true);
  }
}

// Must check that sender is valid for receiver before this calling this function
export function createConnection(
  manager: NodeManager,
  sender: Node.Sender,
  receiverId: string,
  receiverIndex: number
) {
  const senderNode = manager.nodes[sender.uuid];
  if (!senderNode) {
    throw new Error(`Could not find senderNode with uuid: ${sender.uuid}`);
  }

  const receiverNode = manager.nodes[receiverId];
  if (!receiverNode) {
    throw new Error(`Could not find receiverNode with uuid: ${receiverId}`);
  }

  if (!receiverNode.receivers[sender.type]) {
    throw new Error(
      `${receiverNode.type} does not receive type ${sender.type}`
    );
  }
  const receiver =
    receiverNode && receiverNode.receivers[sender.type][receiverIndex];
  if (!receiver) {
    throw new Error(
      `Could not find receiver with index: ${receiverIndex}\n receivers: ${JSON.stringify(
        receiverNode.receivers,
        null,
        2
      )}\n sender: ${JSON.stringify(senderNode.sender, null, 2)}`
    );
  }

  const innerMap = manager.connections.get(senderNode);

  if (innerMap) {
    innerMap.set(receiverNode, receiverIndex);
  } else {
    const newInnerMap: Map<NodeDefault, number> = new Map();
    newInnerMap.set(receiverNode, receiverIndex);
    manager.connections.set(senderNode, newInnerMap);
  }

  receiver.from = senderNode;
  sender.to.add(receiverNode);
  finalizeConnection(manager, senderNode, receiverNode);
}

export function finalizeConnection(
  manager: NodeManager,
  senderNode: Node.Data<any, Node.Receivers>, // eslint-disable-line
  receiverNode: Node.Data<any, Node.Receivers>, // eslint-disable-line
  isDelete = false
) {
  switch (senderNode.type) {
    case "ShaderModule": {
      receiverNode.body.module = isDelete
        ? null
        : manager.device.createShaderModule(senderNode.body);
      break;
    }
    case "VertexState": {
      receiverNode.body.vertex = isDelete ? null : senderNode.body;
      break;
    }
    case "FragmentState": {
      receiverNode.body.fragment = isDelete ? null : senderNode.body;
      break;
    }
    case "RenderPipeline": {
      receiverNode.body.renderPipeline = isDelete
        ? null
        : manager.device.createRenderPipeline(senderNode.body);
      break;
    }
    case "CanvasPanel": {
      receiverNode.body.canvasPointer = senderNode.body;
      break;
    }
    case "RenderPass": {
      receiverNode.body.renderPassDesc = isDelete ? null : senderNode.body;
      break;
    }
    case "DrawCall": {
      break;
    }
    case "Buffer": {
      receiverNode.body.buffer = isDelete ? null : senderNode.body.buffer;
      break;
    }
    case "VertexAttribute": {
      const index = receiverNode.receivers["VertexAttribute"].findIndex(
        (receiver) => receiver.from === senderNode
      );
      receiverNode.body.attributes[index] = senderNode.body;
      break;
    }
    case "VertexBufferLayout": {
      const index = receiverNode.receivers["VertexBufferLayout"].findIndex(
        (receiver) => receiver.from === senderNode
      );
      receiverNode.body.buffers[index] = senderNode.body;
      break;
    }
    case "Data": {
      receiverNode.body.size = senderNode.body.data.byteLength;
      receiverNode.body.buffer = manager.device.createBuffer(receiverNode.body);
      manager.device.queue.writeBuffer(
        receiverNode.body.buffer,
        0,
        senderNode.body.data
      );
      break;
    }
    default: {
      throw new Error(
        "Fallthrough case, connection not created: " + senderNode.type
      );
    }
  }
}

export function updateConnections(
  manager: NodeManager,
  node: NodeDefault
) {
  for (const sendTo of node.sender.to) {
    const receiverNode = manager.nodes[sendTo.uuid];
    finalizeConnection(manager, node, receiverNode);
    updateConnections(manager, receiverNode);
  }
}
