import { NodeContext } from "components";
import { Color } from "data";
import { FC, useContext, useState } from "react";

const type = "VertexBufferLayout";
const VertexBufferLayoutInit: NodeInitFn<GPUVertexBufferLayoutEXT> = (
  uuid,
  xyz
) => ({
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
  receivers: [
    {
      uuid,
      type: "ShaderModule",
      from: null,
    },
  ],
});

type VertexBufferLayoutProps = PanelProps<GPUVertexBufferLayoutEXT>;
const VertexBufferLayoutPanel: FC<VertexBufferLayoutProps> = ({
  uuid,
  body,
}) => {
  const { dispatch } = useContext(NodeContext);
  const [arrayStride, setArrayStride] = useState<number>(body.arrayStride);

  const handleEditArrayStride = (evt: React.ChangeEvent) => {
    const value = (evt.target as HTMLInputElement).value;
    const arrayStride = parseInt(value);
  };

  const handleAddAttribute = (evt: React.MouseEvent) => {
    evt.preventDefault();
  };

  return (
    <div className="buffer">
      <div>Layout</div>
      <div className="attributes">
        <label>Array Stride:</label>
        <input
          type="number"
          value={arrayStride}
          onChange={(evt) => handleEditArrayStride(evt)}
        />
        <label>Attributes:</label>
        <button onClick={(evt) => handleAddAttribute(evt)}>
          Add Attribute
        </button>
      </div>
    </div>
  );
};

export { VertexBufferLayoutPanel, VertexBufferLayoutInit };
