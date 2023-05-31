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

export const viewBoxCoords = (x: n, y: n, view: any): [n, n] => {
  return [
    (x / window.innerWidth) * view.viewBox[2] + view.viewBox[0],
    (y / window.innerHeight) * view.viewBox[3] + view.viewBox[1],
  ];
}

