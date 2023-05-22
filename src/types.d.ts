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

type PanelProps<T> = {
  body: T;
  children: React.ReactNode;
};
