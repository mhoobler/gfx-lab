import { assert } from "chai";
import { Node } from "data";

global.structuredClone = <T>(val: T) => JSON.parse(JSON.stringify(val));

describe("Node Modules", () => {
  const uuid = "not a default";
  const position = [18289, 238196];
  const modules = Object.keys(Node.Modules)
  let node: Node.Instance;
  assert.equal(true, true);

  for (const name of modules) {
    it(`${name}: initializes a node by overriding UUID and Position`, () => {
      node = Node.init(uuid, position, name as Node.Type);
      assert.equal(node.uuid, uuid);
      assert.deepEqual(node.position, position);
    });

    it(`${name}: Instance.type matches Node.Modules[key]`, () => {
      assert.equal(name, node.type);
    });
  }
});
