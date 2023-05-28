import { NodeInitFn } from "../components";

it("runs all NodeInitFn functions", () => {
  const uuid = "test-uuid";
  const xyz: [n, n, n] = [0, 0, 0];
  for (const fn of Object.keys(NodeInitFn)) {
    NodeInitFn[fn](uuid, xyz);
  }
});
