import { FC, useContext, useState } from "react";
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
  const { uuid, body } = data;
  const [offset, setOffset] = useState(body.offset.toString());
  const [shaderLocation, setShaderLocation] = useState(
    body.shaderLocation.toString()
  );

  const handleEditLocation = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    const shaderLocation = parseInt(value);

    if (!isNaN(shaderLocation)) {
      body.shaderLocation = shaderLocation;
      dispatch({ type: "EDIT_NODE_BODY", payload: { uuid, body } });
    }
    setShaderLocation(value);
  };

  const handleEditFormat = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const value = evt.target.value;
    body.format = value as GPUVertexFormat;

    dispatch({ type: "EDIT_NODE_BODY", payload: { uuid, body } });
  };

  const handleEditOffset = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    const offset = parseInt(value);

    if (!isNaN(offset)) {
      body.offset = offset;
      dispatch({ type: "EDIT_NODE_BODY", payload: { uuid, body } });
    }
    setOffset(value);
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
          value={shaderLocation}
          data-key={"shaderLocation"}
        />
        <input
          onChange={handleEditOffset}
          type="number"
          value={offset}
          data-key={"offset"}
        />
        <select
          onChange={handleEditFormat}
          value={body.format}
          data-key={"format"}
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
