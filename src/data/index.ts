export type n = number;

export class Color {
  xyzw: [n, n, n, n];

  constructor(r: n, g: n, b: n, a: n = 1) {
    this.xyzw = [r, g, b, a];
  }

  get r() {
    return this.xyzw[0];
  }
  set r(n: n) {
    this.xyzw[0] = n;
  }

  get b() {
    return this.xyzw[2];
  }
  set b(n: n) {
    this.xyzw[2] = n;
  }

  get g() {
    return this.xyzw[1];
  }
  set g(n: n) {
    this.xyzw[1] = n;
  }

  get a() {
    return this.xyzw[3];
  }
  set a(n: n) {
    this.xyzw[3] = n;
  }

  hexValue() {
    return `#${((this.r << 16) + (this.g << 8) + this.b).toString(16)}`;
  }
  rgbaValue() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}

export class NODE_COLORS {
  static ShaderModule = new Color(255, 255, 0);
  static VertexState = new Color(255, 0, 125);
  static FragmentState = new Color(0, 255, 0);
  static RenderPipeline = new Color(0, 0, 255);
  static CanvasPanel = new Color(255, 255, 255);
}

export class NODE_SIZE {
  static ShaderModule: [n, n] = [400, 800];
  static VertexState: [n, n] = [200, 200];
  static FragmentState: [n, n] = [200, 200];
  static RenderPipeline: [n, n] = [200, 200];
  static CanvasPanel: [n, n] = [200, 200];
}

export class NodeData<T> {
  xyz: [n, n, n];
  width: n;
  height: n;
  headerColor: Color;
  body: T;

  constructor(color: Color, size: [n, n], body: T) {
    this.headerColor = color;
    this.body = body;
    this.width = size[0];
    this.height = size[1];
    //GPUTypeToColor(body);
  }
}
