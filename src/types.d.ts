type DefaultProps = { children: React.ReactNode };
type WgpuContextState = {
  device?: GPUDevice;
  format?: GPUTextureFormat;
  adapter?: GPUAdapter;
  error?: Error;
};

interface GPUCanvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}
