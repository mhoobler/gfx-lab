import {HELLO_VERTEX, HELLO_VERTEX_DATA} from "data";
import { NodeInitFn, VertexStateUtils } from "../../components";

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

export function addNode<T>(manager: NodeManager, node: NodeData<T>): string {
  if (!manager.byCategory[node.type]) {
    manager.byCategory[node.type] = [];
  }
  manager.byCategory[node.type].push(node.uuid);
  manager.nodes[node.uuid] = node;
  return node.uuid;
}

export function initManagerWithJunk(manager: NodeManager) {
  let z = 0;

  const canvasPanel = NodeInitFn.CanvasPanel(uuid(), [600, 200, z++]);
  addNode(manager, canvasPanel);

  const shaderModule = NodeInitFn.ShaderModule(uuid(), [0, 200, z++]);
  addNode(manager, shaderModule);
  shaderModule.body.code = HELLO_VERTEX;

  const vertexState = NodeInitFn.VertexState(uuid(), [200, 0, z++]);
  const layout = VertexStateUtils.newLayout();
  layout.arrayStride = 20;
  layout.attributes = [
    { shaderLocation: 0, offset: 0, format: "float32x2" }, // position
    { shaderLocation: 1, offset: 8, format: "float32x3" }, // color
  ];
  (vertexState.body.buffers as Array<GPUVertexBufferLayout>).push(layout);
  addNode(manager, vertexState);

  const dataNode = NodeInitFn.Data(uuid(), [-200, 0, z++]);
  dataNode.body.text = HELLO_VERTEX_DATA;

  dataNode.body.data = new Float32Array(
    HELLO_VERTEX_DATA.split(",")
      .map((n) => parseFloat(n))
      .filter((e) => !isNaN(e))
  );
  addNode(manager, dataNode);

  const bufferNode = NodeInitFn.Buffer(uuid(), [0, 0, z++]);
  (bufferNode.body.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST),
    addNode(manager, bufferNode);

  const fragmentState = NodeInitFn.FragmentState(uuid(), [400, 200, z++]);
  addNode(manager, fragmentState);

  const renderPipeline = NodeInitFn.RenderPipeline(uuid(), [600, 0, z++]);
  addNode(manager, renderPipeline);
  fragmentState.body.targets = [{ format: manager.format }]; //TODO

  const renderPass = NodeInitFn.RenderPass(uuid(), [800, 200, z++]);
  addNode(manager, renderPass);

  const commandEncoder = NodeInitFn.CommandEncoder(uuid(), [1000, 200, z++]);
  addNode(manager, commandEncoder);

  const drawCall = NodeInitFn.DrawCall(uuid(), [800, 0, z++]);
  addNode(manager, drawCall);
}

export function render(manager: NodeManager) {
  for (const cID of manager.byCategory["CommandEncoder"]) {
    const command = manager.nodes[
      cID
    ] as NodeData<GPUCommandEncoderDescriptorEXT>;
    if (command.body.renderPassDesc) {
      command.body.renderPassDesc.colorAttachments[0].view =
        command.body.renderPassDesc.createView();

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
