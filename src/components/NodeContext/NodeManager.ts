import {getAllNodes} from "node_utils";
import {
  NodeFactory,
  NodeData,
  INodeSender,
  NodeConnection,
  GPUType,
  INodeReceiver,
  createNodeData,
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

var lut = [];
for (var i = 0; i < 256; i++) {
  lut[i] = (i < 16 ? "0" : "") + i.toString(16);
}

// https://stackoverflow.com/a/21963136/10606203
function uuid() {
  var d0 = (Math.random() * 0xffffffff) | 0;
  var d1 = (Math.random() * 0xffffffff) | 0;
  var d2 = (Math.random() * 0xffffffff) | 0;
  var d3 = (Math.random() * 0xffffffff) | 0;
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

class NodeManager {
  device: GPUDevice;
  format: GPUTextureFormat;
  shaderModules: NodeData<GPUShaderModuleDescriptor>[];
  _gpuShaderModules: GPUShaderModule[];
  renderPipelines: NodeData<GPURenderPipelineDescriptor>[];
  _gpuRenderPipelines: GPURenderPipeline[];
  vertexStates: NodeData<GPUVertexState>[];
  fragmentStates: NodeData<GPUFragmentState>[];
  canvasPanels: NodeData<GPUCanvasPanel>[];
  renderPasses: NodeData<GPURenderPassDescriptorEXT>[];
  commandEncoders: NodeData<GPUCommandEncoderDescriptorEXT>[];
  drawCalls: NodeData<GPUDrawCall>[];

  constructor(device: GPUDevice, format: GPUTextureFormat) {
    this.shaderModules = [];
    this._gpuShaderModules = [];
    this.renderPipelines = [];
    this._gpuRenderPipelines = [];
    this.vertexStates = [];
    this.fragmentStates = [];
    this.canvasPanels = [];
    this.device = device;
    this.format = format;
    this.renderPasses = [];
    this.commandEncoders = [];
    this.drawCalls = []
  }
}

export function initManagerWithJunk(
  manager: NodeManager,
  device: GPUDevice,
  format: GPUTextureFormat
) {
  let z = 0;

  manager.canvasPanels = [
    NodeFactory.CanvasPanel(uuid(), [600, 200, z++]),
  ];

  manager.shaderModules = [
    NodeFactory.ShaderModule(uuid(), [0, 0, z++]),
  ];
  manager.shaderModules[0].body.code = HELLO_TRIANGLE;

  manager.vertexStates = [
    NodeFactory.VertexState(uuid(), [400, 0, z++]),
  ];

  manager.fragmentStates = [
    NodeFactory.FragmentState(uuid(), [400, 200, z++]),
  ];
  manager.fragmentStates[0].body.targets = [{format}];

  manager.renderPipelines = [
    NodeFactory.RenderPipeline(uuid(), [600, 0, z++]),
  ];

  manager.renderPasses = [
    NodeFactory.RenderPass(uuid(), [800, 200, z++]),
  ];

  manager.commandEncoders = [
    NodeFactory.CommandEncoder(uuid(), [800, 400, z++]),
  ]

  manager.drawCalls = [
    NodeFactory.DrawCall(uuid(), [800, 0, z++]),
  ];

  //render(manager, device);
}

export function render(manager: NodeManager, device: GPUDevice) {
  const renderPassDescriptor: GPURenderPassDescriptorEXT = {
    label: "our basic canvas renderPass",
    colorAttachments: [
      {
        view: undefined,
        clearValue: [0.0, 0.0, 0.3, 1],
        loadOp: "clear",
        storeOp: "store",
      },
    ],
    createView: () =>
      manager.canvasPanels[0].body.ctx.getCurrentTexture().createView(),
  };

  renderPassDescriptor.colorAttachments[0].view =
    renderPassDescriptor.createView();
  //renderPassDescriptor.colorAttachments[0].view = manager.canvasPanels[0].body.ctx.getCurrentTexture().createView()
  const encoder = device.createCommandEncoder({ label: "our encoder" });
  const pass = encoder.beginRenderPass(renderPassDescriptor);
  pass.setPipeline(manager._gpuRenderPipelines[0]);
  pass.draw(3); // call our vertex shader 3 times
  pass.end();

  const commandBuffer = encoder.finish();
  device.queue.submit([commandBuffer]);
}

export function render2(manager: NodeManager) {
  //let allNodes = getAllNodes(manager);

  for(let canvasPanel of manager.canvasPanels) {
    canvasPanel.body.ctx.configure({
      device: manager.device,
        format: manager.format,
    });
  }
  console.log("render2");
  for(let command of manager.commandEncoders) {
    command.body.renderPassDesc.colorAttachments[0].view =
      command.body.renderPassDesc.createView();

    let encoder = manager.device.createCommandEncoder(command.body);
    let pass = encoder.beginRenderPass(command.body.renderPassDesc);

    for(let drawCall of manager.drawCalls) {
      pass.setPipeline(drawCall.body.renderPipeline);
      pass.draw(drawCall.body.vertexCount);
      pass.end();
    }

    const commandBuffer = encoder.finish();
    manager.device.queue.submit([commandBuffer]);
  }
}

export default NodeManager;
