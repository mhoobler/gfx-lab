import { NodeInitFn } from "components";
import { NodeBodyForJson } from "components/panels";
import { BindGroupData } from "components/panels/BindGroupPanel/BindGroupPanel";
import { BufferData } from "components/panels/BufferPanel/BufferPanel";
import { CommandEncoderData } from "components/panels/CommandEncoderPanel/CommandEncoderPanel";
import { DrawCallData } from "components/panels/DrawCallPanel/DrawCallPanel";
import { RenderPassData } from "components/panels/RenderPassPanel/RenderPassPanel";
import { RenderPipelineData } from "components/panels/RenderPipelinePanel/RenderPipelinePanel";
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

type ByCategory = { [Property in keyof Node.Type]: Set<string> };
type ConnectionMap = Map<Node.Default, Map<Node.Default, number>>;
export class NodeManager {
  device: GPUDevice;
  format: GPUTextureFormat;
  nodes: {
    [key: string]: Node.Default;
  };
  connections: ConnectionMap;
  byCategory: ByCategory;

  constructor(device: GPUDevice, format: GPUTextureFormat) {
    this.device = device;
    this.format = format;
    this.connections = new Map();

    this.nodes = {};
    this.byCategory = {} as ByCategory;
    for (const category of NODE_TYPE_PRIORITY) {
      this.byCategory[category] = new Set();
    }
  }
}

export function loadJson(
  manager: NodeManager,
  json: { [key: string]: Node.Json }
) {
  manager.nodes = {};
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
        if (type === "RenderPass") {
          const b = newNode.body as GPURenderPassDescriptorEXT;
          for (const receiverOrder of b.receiversOrder) {
            newNode.receivers[receiverOrder.type].push({
              uuid,
              type: receiverOrder.type,
              from: null,
            });
          }
        }
      }
      if (size) {
        newNode.size = size;
      }
    }
  }

  const orderedNodes = NODE_TYPE_PRIORITY.flatMap((nodeType) => {
    if (manager.byCategory[nodeType]) {
      return [...manager.byCategory[nodeType]];
    }
    return [];
  }).map((uuid) => manager.nodes[uuid]);

  for (const senderNode of orderedNodes) {
    const { connections } = json[senderNode.uuid];
    if (connections) {
      for (const { uuid, receiverIndex } of connections) {
        const receiverNode = manager.nodes[uuid];
        while (
          receiverNode.receivers[senderNode.type].length <= receiverIndex
        ) {
          receiverNode.receivers[senderNode.type].push({
            uuid,
            type: senderNode.type,
            from: null,
          });
        }
        createConnection(manager, senderNode.sender, uuid, receiverIndex);
      }
    }
  }
}

export function saveJson(
  manager: NodeManager,
  zoom: number,
  position: number[]
) {
  const orderedNodes = NODE_TYPE_PRIORITY.flatMap((nodeType) => {
    if (manager.byCategory[nodeType]) {
      return [...manager.byCategory[nodeType]];
    }
    return [];
  }).map((uuid) => manager.nodes[uuid]);

  for (const nodeType of NODE_TYPE_PRIORITY) {
    const uuids = manager.byCategory[nodeType];
    for (const uuid of uuids) {
      orderedNodes.push(manager.nodes[uuid]);
    }
  }

  const json = {
    name: "Test Save",
    zoom: Math.round(zoom),
    position: position.map((num) => Math.round(num)),
    nodes: {},
  };
  for (const senderNode of orderedNodes) {
    const { uuid, xyz, type, body, sender } = senderNode;

    const connections = [...sender.to].map((receiverNode) => {
      //const receiverIndex = getReceiverIndex(receiverNode);
      const receiverIndex = findReceiverIndex(senderNode, receiverNode);
      return { uuid: receiverNode.uuid, receiverIndex };
    });

    const nodeJson = {
      uuid,
      xyz: xyz.map((num) => Math.round(num)),
      type,
      body: NodeBodyForJson[type](body as any),
      connections,
    };
    json.nodes[uuid] = nodeJson;
  }

  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(json, null, 2));
  const dlAnchorElem = document.createElement("a");
  const root = document.querySelector("#app");
  root.appendChild(dlAnchorElem);
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "scene.json");
  dlAnchorElem.click();
  root.removeChild(dlAnchorElem);
}

export function createNode(
  manager: NodeManager,
  type: Node.Type,
  xyz: [n, n, n]
) {
  const newNode = NodeInitFn[type](uuid(), xyz);
  addNode(manager, newNode);
}

export function addNode<T extends Node.Default>(manager: NodeManager, node: T) {
  if (!manager.byCategory[node.type]) {
    manager.byCategory[node.type] = new Set();
  }
  manager.byCategory[node.type].add(node.uuid);

  manager.nodes[node.uuid] = node;
}

export function render(manager: NodeManager) {
  for (const cID of manager.byCategory["CommandEncoder"]) {
    const command = manager.nodes[cID] as CommandEncoderData;

    if (
      command.body.renderPassDesc &&
      command.body.renderPassDesc.canvasPointer.createView
    ) {
      command.body.renderPassDesc.colorAttachments[0].view =
        command.body.renderPassDesc.canvasPointer.createView();

      const encoder = manager.device.createCommandEncoder(command.body);

      const lim = command.receivers["RenderPass"].length;
      for (let i = 0; i < lim; i++) {
        const renderPass = command.receivers["RenderPass"][i]
          .from as RenderPassData;
        const pass = encoder.beginRenderPass(renderPass.body);
        const receiversOrder = Object.values(renderPass.body.receiversOrder);

        for (const { type, index, value } of receiversOrder) {
          switch (type) {
            case "CanvasPanel": {
              break;
            }
            case "BindGroup": {
              const node = renderPass.receivers[type][index]
                .from as BindGroupData;
              if (node && node.sender.value) {
                const bindGroup = node.sender.value as GPUBindGroup;
                pass.setBindGroup(value, bindGroup);
              }
              break;
            }
            case "Buffer": {
              const node = renderPass.receivers[type][index].from as BufferData;
              if (node && node.sender.value) {
                const buffer = node.sender.value as GPUBuffer;
                pass.setVertexBuffer(value, buffer);
              }
              break;
            }
            case "RenderPipeline": {
              const node = renderPass.receivers[type][index]
                .from as RenderPipelineData;
              if (node && node.sender.value) {
                const pipeline = node.sender.value as GPURenderPipeline;
                pass.setPipeline(pipeline);
              }
              break;
            }
            case "DrawCall": {
              const uuid = renderPass.receivers[type][index].from.uuid;
              const node = manager.nodes[uuid] as DrawCallData;
              if (node && node.body.vertexCount) {
                const { vertexCount, instanceCount } = node.body;
                pass.draw(vertexCount, instanceCount);
              }
              break;
            }
            default: {
              console.error("RenderPass Fallthrough Case");
            }
          }
        }
        pass.end();
      }

      const commandBuffer = encoder.finish();
      manager.device.queue.submit([commandBuffer]);
    }
  }
}

export function getAllNodes(manager: NodeManager) {
  const arr = [...Object.values(manager.nodes)].sort(
    (a, b) => a.xyz[2] - b.xyz[2]
  );

  arr.forEach((node: Node.Default, i: number) => {
    node.xyz[2] = i;
  });
  return arr;
}

function getNodeConnection(
  senderNode: Node.Default,
  receiverNode: Node.Default,
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
    finalizeConnection(manager, senderNode, receiverNode, true);
    updateConnections(manager, receiverNode);

    receiverNode.receivers[senderNode.type][receiverIndex].from = null;
    senderNode.sender.to.delete(receiverNode);
    innerMap.delete(receiverNode);
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
    const newInnerMap: Map<Node.Default, number> = new Map();
    newInnerMap.set(receiverNode, receiverIndex);
    manager.connections.set(senderNode, newInnerMap);
  }

  receiver.from = senderNode;
  sender.to.add(receiverNode);
  finalizeConnection(manager, senderNode, receiverNode);
  updateConnections(manager, receiverNode);
}

function findReceiverIndex(
  senderNode: Node.Data<GPUBase, Node.Receivers>,
  receiverNode: Node.Data<GPUBase, Node.Receivers>
) {
  const index = receiverNode.receivers[senderNode.type].findIndex(
    (receiver: Node.Receiver) => receiver.from.uuid === senderNode.uuid
  );
  if (index < 0) {
    throw new Error("Cound not find ReceiverIndex");
  }
  return index;
}

export function finalizeConnection(
  manager: NodeManager,
  senderNode: Node.Data<any, Node.Receivers>, // eslint-disable-line
  receiverNode: Node.Data<any, Node.Receivers>, // eslint-disable-line
  isDelete = false
) {
  switch (senderNode.type) {
    case "ShaderModule": {
      senderNode.sender.value = isDelete
        ? null
        : manager.device.createShaderModule(senderNode.body);
      receiverNode.body.module = senderNode.sender.value;
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
      senderNode = senderNode as Node.Data<GPURenderPipelineDescriptor>;
      try {
        senderNode.sender.value = isDelete
          ? null
          : manager.device.createRenderPipeline(senderNode.body);
        if (receiverNode.type === "BindGroup") {
          const value = senderNode.sender.value as GPURenderPipeline;
          receiverNode = receiverNode as Node.Data<GPUBindGroupDescriptor>;

          receiverNode.body.layout = value.getBindGroupLayout(
            senderNode.body.layoutIndex
          );
          senderNode.body.layoutIndex++;
        }
      } catch (err) {
        senderNode.sender.value = null;
      }
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
      if (isDelete) {
        senderNode.sender.value = null;
      } else {
        senderNode.sender.value = manager.device.createBuffer(senderNode.body);
        const { data } = senderNode.body;
        if (data) {
          const buffer = senderNode.sender.value as GPUBuffer;
          manager.device.queue.writeBuffer(buffer, 0, data);
          if (receiverNode.type === "BindGroupEntry") {
            receiverNode.body.resource.buffer = buffer;
          }
        }
      }

      break;
    }
    case "VertexAttribute": {
      const index = findReceiverIndex(senderNode, receiverNode);
      if (isDelete) {
        receiverNode.body.attributes[index] = null;
      } else {
        receiverNode.body.attributes[index] = senderNode.body;
      }
      break;
    }
    case "VertexBufferLayout": {
      const index = findReceiverIndex(senderNode, receiverNode);
      if (isDelete) {
        receiverNode.body.buffers[index] = null;
      } else {
        receiverNode.body.buffers[index] = senderNode.body;
      }
      break;
    }
    case "Data": {
      if (isDelete) {
        const data = new Float32Array();
        receiverNode.body.data = data;
        receiverNode.body.size = data.byteLength;
      } else {
        receiverNode.body.data = senderNode.body.data;
        receiverNode.body.size = senderNode.body.data.byteLength;
      }
      break;
    }
    case "BindGroupEntry": {
      const index = findReceiverIndex(senderNode, receiverNode);
      if (isDelete) {
        receiverNode.body.entries = receiverNode.body.entries[index] = null;
      } else {
        receiverNode.body.entries[index] = senderNode.body;
      }
      break;
    }
    case "BindGroup": {
      if (isDelete) {
        senderNode.sender.value = null;
      } else {
        senderNode.sender.value = manager.device.createBindGroup(
          senderNode.body
        );
      }

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
  senderNode: Node.Default
) {
  for (const sendTo of senderNode.sender.to) {
    const receiverNode = manager.nodes[sendTo.uuid];
    finalizeConnection(manager, senderNode, receiverNode);
    updateConnections(manager, receiverNode);
  }
}
