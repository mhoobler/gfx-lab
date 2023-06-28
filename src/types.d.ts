type DefaultProps = { children: React.ReactNode };
type n = number;

interface GPUBase {
  label?: string;
}

type WgpuContextState = {
  device?: GPUDevice;
  format?: GPUTextureFormat;
  adapter?: GPUAdapter;
  error?: Error;
};

interface GPUCanvasPanel {
  label: string;
  canvas: HTMLCanvasElement;
  ctx: GPUCanvasContext;
  createView: () => GPUTextureView;
}

interface GPUVertexAttributeEXT extends GPUVertexAttribute {
  label?: string;
}

interface GPUVertexBufferLayoutEXT extends GPUVertexBufferLayout {
  label?: string;
}

interface GPUVertexStateEXT extends GPUVertexState {
  label?: string;
}

interface GPUBindGroupEntry extends GPUVertexState {
  label?: string;
}

interface GPUBindGroupDescriptorEXT extends GPUBindGroupDescriptor {
  label?: string;
  layoutIndex: n | null;
}

interface GPURenderPassDescriptorEXT extends GPURenderPassDescriptor {
  canvasPointer: GPUCanvasPanel;
  receiversOrder?: {
    // Node.Type
    type: string;
    // Node.Dta.uuid
    uuid: string;
    index: n;
    value: any;
  }[];
}

interface GPUCommandEncoderDescriptorEXT extends GPUObjectDescriptorBase {
  renderPassDesc: GPURenderPassDescriptorEXT;
  drawCall: GPUDrawCall[];
}

interface GPUDrawCall extends GPUObjectBase {
  renderPipeline?: GPURenderPipeline;
  vertexCount: number;
  instanceCount?: number;
  firstVertex?: number;
  firstInstance?: number;
}

interface GPUData extends GPUObjectBase {
  text: string;
  data?: Float32Array | Float64Array | Uint32Array | Uint16Array;
}

interface IColor {
  xyzw: [n, n, n, n];
  hexString: () => string;
  rgbaString: () => string;
}

type PanelProps<T> = {
  data: T;
  children: React.ReactNode;
};
