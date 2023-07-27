import { Receiver } from "components/Receiver/Receiver";
import { Node } from "data";

type Generic<T = unknown> = {
  resource: Array<T>,
  index: number,
}; 
const receivers: Node.Receiver<Generic>[] = [[["MousePosition"], "resource", null]];

const component = ({ instance, context }) => {
  const { uuid, body } = instance;

  return (
    <div className="node-body vertex-state">
      <input
        type="number"
        name="index"
        value={body.index}
        onChange={() => {}}
      />
      <Receiver
        uuid={uuid}
        property="resource"
        index={null}
        objectKey={null}
        types={receivers[0][0]}
        value={body.resource}
      />
    </div>
  );
};

const DEFAULT = {
  uuid: "UNASSIGNED",
  label: "IndexedValue",
  type: "IndexedValue",
  position: [0, 0],
  size: [200, 200],
  body: {
    resource: null,
    index: null,
  },
  resizable: false,
};

const IndexedValue: Node.Module<Generic> = {
  sender: (_state, node) => node.body.resource[node.body.index],
  component,
  default: DEFAULT,
  json: (node) => {
    const { index } = node.body;
    return { index };
  },
  receivers,
};

export { IndexedValue };
