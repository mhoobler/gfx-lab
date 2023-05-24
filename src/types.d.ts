type DefaultProps = { children: React.ReactNode };
type n = number;

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
}

interface GPURenderPassDescriptorEXT extends GPURenderPassDescriptor {
  createView: (() => GPUTextureView) | null
}

interface GPUCommandEncoderDescriptorEXT extends GPUObjectDescriptorBase {
  renderPassDesc: GPURenderPassDescriptorEXT
}

interface GPUDrawCall extends GPUObjectBase {
  commandEncoderDesc: GPUCommandEncoderDescriptorEXT
  renderPipeline?: GPURenderPipeline;
  vertexCount: number;
  instanceCount?: number;
  firstVertex?: number;
  firstInstance?: number;
}

type PanelProps<T> = {
  body: T;
  uuid: string;
  children: React.ReactNode;
};
