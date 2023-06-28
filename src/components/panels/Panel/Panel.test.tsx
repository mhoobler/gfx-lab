import { render } from "@testing-library/react";
import { NodeInitFn, Panel } from "..";
import "jest-canvas-mock";
it("contains input-container class", () => {
  const xyz = [0, 0, 0];
  const nodeInits = Object.values(NodeInitFn).map((e, i) => {
    return e(i.toString(), xyz);
  });

  for (const nodeData of nodeInits) {
    const { container } = render(<Panel data={nodeData} />);
    const result = container.querySelector(".input-container");
    try {
      expect(result).not.toBeFalsy();
    } catch (err) {
      throw new Error(`Failed NodeType: ${nodeData.type}`);
    }
  }
});
