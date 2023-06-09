export * as Node from "./node";

export class Color implements IColor {
  static Red = new Color(255, 0, 0);
  static Green = new Color(0, 255, 0);
  static Blue = new Color(0, 0, 255);
  static Pink = new Color(255, 200, 200);
  static Cyan = new Color(0, 255, 255);
  static Maroon = new Color(125, 0, 0);
  static Sage = new Color(0, 125, 0);

  xyzw: [n, n, n, n];

  constructor(r: n, g: n, b: n, a: n = 1) {
    this.xyzw = [r, g, b, a];
  }

  hexString() {
    const [r, g, b] = this.xyzw;
    return `${((r << 16) + (g << 8) + b).toString(16)}`;
  }
  rgbaString() {
    const [r, g, b, a] = this.xyzw;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
}

export const VertexFormats: ReadonlyArray<GPUVertexFormat> = [
  "uint8x2",
  "uint8x4",
  "sint8x2",
  "sint8x4",
  "unorm8x2",
  "unorm8x4",
  "snorm8x2",
  "snorm8x4",
  "uint16x2",
  "uint16x4",
  "sint16x2",
  "sint16x4",
  "unorm16x2",
  "unorm16x4",
  "snorm16x2",
  "snorm16x4",
  "float16x2",
  "float16x4",
  "float32",
  "float32x2",
  "float32x3",
  "float32x4",
  "uint32",
  "uint32x2",
  "uint32x3",
  "uint32x4",
  "sint32",
  "sint32x2",
  "sint32x3",
  "sint32x4",
];

export const BufferUsageKeys = [
  "VERTEX",
  "COPY_DST",
  "COPY_SRC",
  "COPY_UNIFORM",
  "STORAGE",
];

// Helps testing
const GPUBufferUsage = {
  MAP_READ: 1,
  MAP_WRITE: 2,
  COPY_SRC: 4,
  COPY_DST: 8,
  INDEX: 16,
  VERTEX: 32,
  UNIFORM: 64,
  STORAGE: 128,
  INDIRECT: 256,
  QUERY_RESOLVE: 512,
};
export const BufferUsageTable: ReadonlyArray<[string, number]> = [
  ["MAP_READ", GPUBufferUsage.MAP_READ], // 1
  ["MAP_WRITE", GPUBufferUsage.MAP_WRITE], // 2
  ["COPY_SRC", GPUBufferUsage.COPY_SRC], // 4
  ["COPY_DST", GPUBufferUsage.COPY_DST], // 8
  ["INDEX", GPUBufferUsage.INDEX], // 16
  ["VERTEX", GPUBufferUsage.VERTEX], // 32
  ["UNIFORM", GPUBufferUsage.UNIFORM], // 64
  ["STORAGE", GPUBufferUsage.STORAGE], // 128
  ["INDIRECT", GPUBufferUsage.INDIRECT], // 256
  ["QUERY_RESOLVE", GPUBufferUsage.QUERY_RESOLVE], // 512
];

export const HELLO_TRIANGLE = `@vertex fn vs(
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
export const HELLO_VERTEX_DATA = `0.0, 0.5, 1.0, 0.0, 0.0,
 0.5, -0.5, 0.0, 1.0, 0.0,
-0.5, -0.5, 0.0, 0.0, 1.0,`;

export const HELLO_VERTEX = `struct Vertex {
  @location(0) position: vec2f,
  @location(1) color: vec3f,
};

struct VSOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f,
};

@vertex fn vs(
  vert: Vertex,
  @builtin(instance_index) instanceIndex: u32
) -> VSOutput {
  var vsOut: VSOutput;
  vsOut.position = vec4f(vert.position, 1.0, 1.0);
  vsOut.color = vec4f(vert.color, 1.0);
  return vsOut;
}

@fragment fn fs(vsOut: VSOutput) -> @location(0) vec4f {
  return vsOut.color;
}
`;

export const NODE_TYPE_PRIORITY: ReadonlyArray<string> = [
  // No receivers
  "ShaderModule",
  "Data",
  "VertexAttribute",
  "CanvasPanel",
  "DrawCall",
  // Step
  "FragmentState",
  "VertexBufferLayout",
  "Buffer",
  // Step
  "BindGroupEntry",
  "VertexState",
  // Step
  "RenderPipeline",
  // Step
  "BindGroup",
  "RenderPass",
  // Step
  "CommandEncoder",
];

export const viewBoxCoords = (x: n, y: n, view: { viewBox: n[] }): [n, n] => {
  return [
    Math.round(
      ((x / window.innerWidth) * view.viewBox[2] + view.viewBox[0]) * 1000
    ) / 1000,
    Math.round(
      ((y / window.innerHeight) * view.viewBox[3] + view.viewBox[1]) * 1000
    ) / 1000,
  ];
};
