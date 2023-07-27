import { Node } from "data";

type Generic = { x: number; y: number };
const receivers: Node.Receiver[] = [];

const component = () => {
  return <div className="node-body mouse-position">0, 0</div>;
};

const DEFAULT = {
  uuid: "UNASSIGNED",
  label: "MousePosition",
  type: "MousePosition",
  position: [0, 0],
  size: [200, 200],
  body: {
    x: 0,
    y: 0,
  },
  resizable: false,
};

const MousePosition: Node.Module<Generic> = {
  sender: (_state, node) => node.body,
  component,
  default: DEFAULT,
  json: (_node) => ({}),
  receivers,
};

export { MousePosition };
