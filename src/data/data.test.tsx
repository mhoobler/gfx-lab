import { Color } from "../data";

it('converts Color to proper CSS strings', () => {
  const color = new Color(255, 0, 0);
  expect(color.xyzw).toStrictEqual([255, 0, 0, 1]);

  const hex = color.hexString();
  expect(hex).toBe("ff0000");

  const rgba = color.rgbaString();
  expect(rgba).toBe("rgba(255, 0, 0, 1)");
});
