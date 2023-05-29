export function relativeCoords(evt: MouseEvent): [n, n] {
  const target = evt.currentTarget as HTMLElement;

  const downX = evt.clientX;
  const downY = evt.clientY;
  const bbX = target.getBoundingClientRect().x;
  const bbY = target.getBoundingClientRect().y;
  const dx = bbX - downX;
  const dy = bbY - downY;

  return [dx, dy];
}

export function centerCoords(elm: HTMLElement): [n, n] {
  const bb = elm.getBoundingClientRect();
  const x = bb.x + bb.width / 2;
  const y = bb.y + bb.height / 2;

  return [x, y];
}

const k = 100;
const ojbectInfos = [];

// prettier-ignore
const staticUnitSize = 
  4 * 4 + 
  2 * 4 +
  2 * 4;

// prettier-ignore
const changingUnitSize = 
  2 * 4;

const vertexBuffer: GPUBufferDescriptor = {
  label: "StaticUniform",
  size: staticUnitSize * k,
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
};

const GPUVertexBuffLay: GPUVertexBufferLayout = {
  arrayStride: 2 * 4,
  attributes: [{ shaderLocation: 0, offset: 0, format: "float32x2" }],
};

const test: () => GPUVertexState = () => ({
  buffers: [],
  constants: {} as { [key: string]: number },
  module: null,
  entryPoint: "vs",
});
