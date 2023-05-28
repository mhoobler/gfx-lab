import { NodeInitFn } from "../../components";

const HELLO_TRIANGLE = `@vertex fn vs(
  @builtin(vertex_index) vertexIndex : u32
) -> @builtin(position) vec4f {
  var pos = array<vec2f, 3>(
    vec2f( 0.0,  0.5),  // top center
    vec2f(-0.5, -0.5),  // bottom left
    vec2f( 0.5, -0.5)   // bottom right
  );

  return vec4f(pos[vertexIndex], 0.0, 1.0);
}

@fragment fn fs() -> @location(0) vec4f {
  return vec4f(1.0, 0.0, 0.0, 1.0);
}`;

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
const node_types: NodeTypes = [
  "ShaderModule",
  "VertexState",
  "FragmentState",
  "CanvasPanel",
  "RenderPipeline",
  "RenderPass",
  "CommandEncoder",
  "DrawCall",
];

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
    const byCategory = {};
    for (const nodeType of node_types) {
      byCategory[nodeType] = [];
    }
    this.byCategory = byCategory as ByCategory;
  }
}

// eslint-disable-next-line
export function addNode(manager: NodeManager, node: NodeData<any>): string {
  manager.byCategory[node.type].push(node.uuid);
  manager.nodes[node.uuid] = node;
  return node.uuid;
}

export function initManagerWithJunk(manager: NodeManager) {
  let z = 0;

  const canvasPanel = NodeInitFn.CanvasPanel(uuid(), [600, 200, z++]);
  const shaderModule = NodeInitFn.ShaderModule(uuid(), [0, 0, z++]);
  const vertexState = NodeInitFn.VertexState(uuid(), [400, 0, z++]);
  const fragmentState = NodeInitFn.FragmentState(uuid(), [400, 200, z++]);
  const renderPipeline = NodeInitFn.RenderPipeline(uuid(), [600, 0, z++]);
  const renderPass = NodeInitFn.RenderPass(uuid(), [800, 200, z++]);
  const commandEncoder = NodeInitFn.CommandEncoder(uuid(), [800, 400, z++]);
  const drawCall = NodeInitFn.DrawCall(uuid(), [800, 0, z++]);

  addNode(manager, canvasPanel);
  addNode(manager, shaderModule);
  shaderModule.body.code = HELLO_TRIANGLE;
  addNode(manager, vertexState);
  addNode(manager, fragmentState);
  fragmentState.body.targets = [{ format: manager.format }]; //TODO
  addNode(manager, renderPipeline);
  addNode(manager, renderPass);
  addNode(manager, commandEncoder);
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

        if (drawCall && drawCall.body.renderPipeline) {
          pass.setPipeline(drawCall.body.renderPipeline);
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
