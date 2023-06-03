import { NodeInitFn } from "components";
import { createConnection } from "node_utils";

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

type ByCategory = { [Property in keyof NodeType]: string[] };
class NodeManager {
  device: GPUDevice;
  format: GPUTextureFormat;
  nodes: { [key: string]: NodeData<GPUBase> };
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
  json: { [key: string]: NodeJson }
) {
  for (const nodeJson of Object.values(json)) {
    const { uuid, type, xyz, size, body } = nodeJson;
    if (!manager.nodes[uuid] && NodeInitFn[type]) {
      const newNode = NodeInitFn[type](uuid, xyz);
      addNode(manager, newNode as NodeData<GPUBase>);

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

  // TODO: Need to sort with "connection priority"
  // Check broken_connection.json vs. hello_vertex.json
  for (const node of Object.values(manager.nodes)) {
    const { connections } = json[node.uuid];
    if (connections) {
      for (const { uuid, receiverIndex } of connections) {
        createConnection(manager, node.sender, uuid, receiverIndex);
      }
    }
  }
}

export function addNode<T>(manager: NodeManager, node: NodeData<T>): string {
  if (!manager.byCategory[node.type]) {
    manager.byCategory[node.type] = [];
  }
  manager.byCategory[node.type].push(node.uuid);
  manager.nodes[node.uuid] = node;
  return node.uuid;
}

export function render(manager: NodeManager) {
  for (const cID of manager.byCategory["CommandEncoder"]) {
    const command = manager.nodes[
      cID
    ] as NodeData<GPUCommandEncoderDescriptorEXT>;
    if (command.body.renderPassDesc) {
      command.body.renderPassDesc.colorAttachments[0].view =
        command.body.renderPassDesc.canvasPointer.createView();

      const encoder = manager.device.createCommandEncoder(command.body);
      const pass = encoder.beginRenderPass(command.body.renderPassDesc);

      const lim = command.receivers.length;
      for (let i = 1; i < lim; i++) {
        const drawCall = command.receivers[i].from as NodeData<GPUDrawCall>;

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

export default NodeManager;
