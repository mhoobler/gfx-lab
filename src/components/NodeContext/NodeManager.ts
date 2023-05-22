import { NodeData, NODE_COLORS, NODE_SIZE } from "../../data";

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

class NodeManager {
  shaderModules: NodeData<GPUShaderModuleDescriptor>[];
  _gpuShaderModules: GPUShaderModule[];
  renderPipelines: NodeData<GPURenderPipelineDescriptor>[];
  _gpuRenderPipelines: GPURenderPipeline[];
  vertexStates: NodeData<GPUVertexState>[];
  fragmentStates: NodeData<GPUFragmentState>[];
  canvasPanels: NodeData<GPUCanvas>[];

  constructor(device: GPUDevice, format: GPUTextureFormat) {
    const canvas = document.getElementById("test-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("webgpu");
    ctx.configure({
      device,
      format,
    });
    this.canvasPanels = [
      new NodeData(NODE_COLORS.CanvasPanel,
                   NODE_SIZE.CanvasPanel,
                   {
        ctx,
        canvas,
      }),
    ];

    this.shaderModules = [
      new NodeData(NODE_COLORS.ShaderModule,
                   NODE_SIZE.ShaderModule, {
        label: "our hardcoded red triangle shaders",
        code: HELLO_TRIANGLE,
      }),
    ];
    const mod = device.createShaderModule(this.shaderModules[0].body);
    this._gpuShaderModules = [mod];

    this.vertexStates = [
      new NodeData(NODE_COLORS.VertexState,
                   NODE_SIZE.VertexState,
                   {
        module: mod,
        entryPoint: "vs",
      }),
    ];

    this.fragmentStates = [
      new NodeData(NODE_COLORS.FragmentState,
                   NODE_SIZE.VertexState, {
        module: mod,
        entryPoint: "fs",
        targets: [{ format }],
      }),
    ];

    this.renderPipelines = [
      new NodeData(NODE_COLORS.RenderPipeline,
                   NODE_SIZE.RenderPipeline, {
        label: "our hardcoded red triangle pipeline",
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

    this.render(device);
  }

  getAllNodes() {
    return [
      ...this.shaderModules,
      ...this.renderPipelines,
      ...this.vertexStates,
      ...this.fragmentStates,
    ];
  }

  render(device: GPUDevice) {
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
      this.canvasPanels[0].body.ctx.getCurrentTexture().createView();

    const encoder = device.createCommandEncoder({ label: "our encoder" });
      const pass = encoder.beginRenderPass(renderPassDescriptor);
      pass.setPipeline(this._gpuRenderPipelines[0]);
      pass.draw(3); // call our vertex shader 3 times
      pass.end();

      const commandBuffer = encoder.finish();
      device.queue.submit([commandBuffer]);

      console.log("Canvas ready");
  }
}

export default NodeManager;
