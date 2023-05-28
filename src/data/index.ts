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
