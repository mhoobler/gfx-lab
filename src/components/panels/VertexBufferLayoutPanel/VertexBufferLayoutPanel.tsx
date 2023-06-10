import { NodeContext, Receiver } from "components";
import { Color, Node } from "data";
import { FC, useContext, useState } from "react";

export type VertexBufferLayoutData = Node.Data<GPUVertexBufferLayoutEXT, Node.Receivers<"VertexAttribute">>;
const type = "VertexBufferLayout";
const VertexBufferLayoutInit: Node.InitFn<VertexBufferLayoutData> = (uuid, xyz) => ({
  type,
  uuid,
  headerColor: new Color(255, 0, 125),
  size: [200, 200],
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

const VertexBufferLayoutJson = (body: GPUVertexBufferLayoutEXT) => {
  const { label, arrayStride } = body;
  return { label, arrayStride };
}

type VertexBufferLayoutProps = PanelProps<VertexBufferLayoutData>;
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
    const receiver = { uuid, type: "VertexAttribute", from: null };
    const index = vertexAttributeReceivers.length;

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
        <Receiver key={uuid + index} receiver={receiver} index={index}>
          {receiver.type}
        </Receiver>
      ))}
      <button onClick={handleAddAttribute}>Add Attribute</button>
    </div>
  );
};

export { VertexBufferLayoutPanel, VertexBufferLayoutInit, VertexBufferLayoutJson };
