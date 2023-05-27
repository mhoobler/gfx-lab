import {
  NodeFactory,
  NodeData,
  NodeType,
  NodeTypes,
  ConnectionMap,
} from "../../data";

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

type ByCategory = { [Property in keyof NodeType]: string[] };
class NodeManager {
  device: GPUDevice;
  format: GPUTextureFormat;
  // eslint-disable-next-line
  nodes: { [key: string]: NodeData<any> };
  connections: ConnectionMap;
  byCategory: ByCategory;

  constructor(device: GPUDevice, format: GPUTextureFormat) {
    this.device = device;
    this.format = format;
    this.connections = new Map();

    this.nodes = {};
    const byCategory = {};
    for (const nodeType of NodeTypes) {
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

  let id: string;
  addNode(manager, NodeFactory.CanvasPanel(uuid(), [600, 200, z++]));
  id = addNode(manager, NodeFactory.ShaderModule(uuid(), [0, 0, z++]));
  manager.nodes[id].body.code = HELLO_TRIANGLE;
  addNode(manager, NodeFactory.VertexState(uuid(), [400, 0, z++]));
  id = addNode(manager, NodeFactory.FragmentState(uuid(), [400, 200, z++]));
  manager.nodes[id].body.targets = [{ format: manager.format }]; //TODO
  addNode(manager, NodeFactory.RenderPipeline(uuid(), [600, 0, z++]));
  addNode(manager, NodeFactory.RenderPass(uuid(), [800, 200, z++]));
  addNode(manager, NodeFactory.CommandEncoder(uuid(), [800, 400, z++]));
  addNode(manager, NodeFactory.DrawCall(uuid(), [800, 0, z++]));
}

export function render(manager: NodeManager) {
  for (const cID of manager.byCategory["CanvasPanel"]) {
    const canvasPanel = manager.nodes[cID];
    canvasPanel.body.ctx.configure({
      device: manager.device,
      format: manager.format,
    });
  }

  for (const cID of manager.byCategory["CommandEncoder"]) {
    const command = manager.nodes[cID];
    if (command.body.renderPassDesc) {
      command.body.renderPassDesc.colorAttachments[0].view =
        command.body.renderPassDesc.createView();

      const encoder = manager.device.createCommandEncoder(command.body);
      const pass = encoder.beginRenderPass(command.body.renderPassDesc);

      const lim = command.receivers.length;
      for (let i = 1; i < lim; i++) {
        const drawCall = command.receivers[i].from;

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
