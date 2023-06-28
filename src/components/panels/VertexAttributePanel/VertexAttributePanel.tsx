import { FC, useContext } from "react";
import { Color, Node } from "data";
import { NodeContext } from "components";

import "./VertexAttributePanel.less";

export type VertexAttributeData = Node.Data<GPUVertexAttributeEXT>;
const type = "VertexAttribute";
const VertexAttributeInit: Node.InitFn<VertexAttributeData> = (uuid, xyz) => ({
  type,
  uuid,
  headerColor: new Color(255, 0, 125),
  size: [400, 75],
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
  receivers: null,
});

const VertexAttributeJson = (body: GPUVertexAttributeEXT) => {
  const { label, shaderLocation, offset, format } = body;
  return { label, shaderLocation, offset, format };
};

type VertexAttributeProps = PanelProps<VertexAttributeData>;
const VertexAttributePanel: FC<VertexAttributeProps> = ({ data }) => {
  const { dispatch } = useContext(NodeContext);
  const { body } = data;

  const handleEditLocation = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    let shaderLocation = parseInt(value);
    if (isNaN(shaderLocation)) {
      shaderLocation = 0;
    }

    evt.target.value = shaderLocation.toString();
    dispatch({
      type: "EDIT_NODE",
      payload: {
        ...data,
        body: {
          ...data.body,
          shaderLocation,
        },
      },
    });
  };

  const handleEditFormat = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const format = evt.target.value as GPUVertexFormat;

    dispatch({
      type: "EDIT_NODE",
      payload: { ...data, body: { ...data.body, format } },
    });
  };

  const handleEditOffset = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    let offset = parseInt(value);
    if (isNaN(offset)) {
      offset = 0;
    }

    evt.target.value = offset.toString();
    dispatch({
      type: "EDIT_NODE",
      payload: { ...data, body: { ...data.body, offset } },
    });
  };

  return (
    <div className="input-container attribute col">
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
        />
        <input
          onChange={handleEditOffset}
          type="number"
          value={body.offset}
        />
        <select
          onChange={handleEditFormat}
          value={body.format}
        >
          <option value="float32x4">float32x4</option>
          <option value="float32x3">float32x3</option>
          <option value="float32x2">float32x2</option>
          <option value="float32">float32</option>
        </select>
      </div>
    </div>
  );
};

export { VertexAttributePanel, VertexAttributeInit, VertexAttributeJson };
