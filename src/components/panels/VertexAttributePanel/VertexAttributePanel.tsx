import { Color } from "data";
import { FC } from "react";

const type = "VertexAttribute";
const VertexAttributeInit: NodeInitFn<GPUVertexAttributeEXT> = (uuid, xyz) => ({
  type,
  uuid,
  headerColor: new Color(255, 0, 125),
  size: [400, 200],
  xyz,
  body: {
    label: type,
    shaderLocation: 0,
    offset: 0,
    format: "float32x4",
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

type VertexAttributeProps = PanelProps<GPUVertexAttributeEXT>;
const VertexAttributePanel: FC<VertexAttributeProps> = ({ uuid, body }) => {
  const handleEditLocation = (evt: React.ChangeEvent) => {};
  const handleEditFormat = (evt: React.ChangeEvent) => {};
  const handleEditOffset = (evt: React.ChangeEvent) => {};

  return (
    <div className="attribute col">
      <div className="labels row">
        <label>Location</label>
        <label>Offset</label>
        <label>Format</label>
      </div>
      <div className="values row">
        <input
          onChange={handleEditLocation}
          type="number"
          value={body.shaderLocation}
          data-key={"shaderLocation"}
        />
        <input
          onChange={handleEditOffset}
          type="number"
          value={body.offset}
          data-key={"offset"}
        />
        <select
          onChange={handleEditFormat}
          value={body.format}
          data-key={"format"}
        >
          <option>float32x4</option>
          <option>float32x3</option>
          <option>float32x2</option>
          <option>float32</option>
        </select>
      </div>
    </div>
  );
};

export { VertexAttributePanel, VertexAttributeInit };
