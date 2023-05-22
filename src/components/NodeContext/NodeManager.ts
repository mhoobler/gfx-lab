import { NodeFactory, NodeData } from "../../data";

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
  shaderModules: NodeData<GPUShaderModuleDescriptor>[];
  _gpuShaderModules: GPUShaderModule[];
  renderPipelines: NodeData<GPURenderPipelineDescriptor>[];
  _gpuRenderPipelines: GPURenderPipeline[];
  vertexStates: NodeData<GPUVertexState>[];
  fragmentStates: NodeData<GPUFragmentState>[];
  canvasPanels: NodeData<GPUCanvasPanel>[];

  constructor(device: GPUDevice, format: GPUTextureFormat) {
    let z = 0;
    const canvas = document.getElementById("test-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("webgpu");

    ctx.configure({
      device,
      format,
    });
    this.canvasPanels = [
      NodeFactory.CanvasPanel(uuid() ,[0, 0, z++], {
        label: "Cavnas Panel",
        ctx,
        canvas,
      }),
    ];

    this.shaderModules = [
      NodeFactory.ShaderModule(uuid(), [200, 200, z++], {
        label: "ShaderModule",
        code: HELLO_TRIANGLE,
      }),
    ];
    const mod = device.createShaderModule(this.shaderModules[0].body);
    this._gpuShaderModules = [mod];

    this.vertexStates = [
      NodeFactory.VertexState(uuid(), [0, 200, z++], {
        label: "VertexState",
        module: mod,
        entryPoint: "vs",
      }),
    ];

    this.fragmentStates = [
      NodeFactory.FragmentState(uuid(), [0, 400, z++], {
        label: "FragmentState",
        module: mod,
        entryPoint: "fs",
        targets: [{ format }],
      }),
    ];

    this.renderPipelines = [
      NodeFactory.RenderPipeline(uuid(), [400, 0, z++], {
        label: "Pipeline",
        layout: "auto",
        vertex: this.vertexStates[0].body,
        fragment: this.fragmentStates[0].body,
        primitive: {
          topology: "triangle-strip",
        },
      }),
    ];
    const pipeline = device.createRenderPipeline(this.renderPipelines[0].body);
    this._gpuRenderPipelines = [pipeline];

    render(this, device);
  }
}

export function getAllNodes(manager: NodeManager) {
  let arr = [
    ...manager.canvasPanels,
    ...manager.shaderModules,
    ...manager.renderPipelines,
    ...manager.vertexStates,
    ...manager.fragmentStates,
  ].sort((a, b) => a.xyz[2] - b.xyz[2]);

  arr.forEach((n: NodeData<any>, i: number) => {
    n.xyz[2] = i;
  });
  return arr;
}

export function render(manager: NodeManager, device: GPUDevice) {
  const renderPassDescriptor: GPURenderPassDescriptor = {
    label: "our basic canvas renderPass",
    colorAttachments: [
      {
        view: undefined,
        clearValue: [0.0, 0.0, 0.3, 1],
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  };

  renderPassDescriptor.colorAttachments[0].view =
    manager.canvasPanels[0].body.ctx.getCurrentTexture().createView();

  const encoder = device.createCommandEncoder({ label: "our encoder" });
  const pass = encoder.beginRenderPass(renderPassDescriptor);
  pass.setPipeline(manager._gpuRenderPipelines[0]);
  pass.draw(3); // call our vertex shader 3 times
  pass.end();

  const commandBuffer = encoder.finish();
  device.queue.submit([commandBuffer]);
}

export default NodeManager;
