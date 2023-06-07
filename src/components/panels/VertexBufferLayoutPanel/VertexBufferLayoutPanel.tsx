import { NodeContext, Receiver2 } from "components";
import { Color } from "data";
import { FC, useContext, useState } from "react";

const type = "VertexBufferLayout";
const VertexBufferLayoutInit: NodeInitFn<
  GPUVertexBufferLayoutEXT,
  "VertexAttribute"
> = (uuid, xyz) => ({
  type,
  uuid,
  headerColor: new Color(255, 0, 125),
  size: [400, 200],
  xyz,
  body: {
    label: type,
    arrayStride: 16,
    attributes: [],
    stepMode: "vertex",
  },
  sender: {
    uuid,
    type,
    value: null,
    to: new Set(),
  },
  receivers: {
    VertexAttribute: [
      {
        uuid,
        type: "VertexAttribute",
        from: null,
      },
    ],
  },
});

type VertexBufferLayoutProps = PanelProps2<
  GPUVertexBufferLayoutEXT,
  "VertexAttribute"
>;
const VertexBufferLayoutPanel: FC<VertexBufferLayoutProps> = ({ data }) => {
  const { dispatch } = useContext(NodeContext);
  const { uuid, body } = data;
  const [arrayStride, setArrayStride] = useState(body.arrayStride.toString());

  const vertexAttributeReceivers = data.receivers["VertexAttribute"];

  const handleEditArrayStride = (evt: React.ChangeEvent) => {
    const value = (evt.target as HTMLInputElement).value;
    const arrayStride = parseInt(value);

    if (!isNaN(arrayStride)) {
      body.arrayStride = arrayStride;
      dispatch({ type: "EDIT_NODE_BODY", payload: { uuid, body } });
    }
    setArrayStride(value);
  };

  const handleAddAttribute = () => {
    let receiver = { uuid, type: "VertexAttribute", from: null };
    let index = vertexAttributeReceivers.length;

    dispatch({ type: "ADD_RECEIVER", payload: { receiver, index } });
  };

  return (
    <div className="input-container vertex-buffer-layout">
      <label>Array Stride: </label>
      <input
        type="number"
        value={arrayStride}
        onChange={handleEditArrayStride}
      />
      {vertexAttributeReceivers.map((receiver, index) => (
        <Receiver2 key={uuid + index} receiver={receiver} index={index}>
          {receiver.type}
        </Receiver2>
      ))}
      <button onClick={handleAddAttribute}>Add Attribute</button>
    </div>
  );
};

export { VertexBufferLayoutPanel, VertexBufferLayoutInit };
