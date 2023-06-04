import { NodeContext } from "components";
import { Color } from "data";
import React, { FC, useContext, useState } from "react";

import "./VertexStatePanel.less";

const type = "VertexState";
const VertexStateInit: NodeInitFn<GPUVertexState> = (uuid, xyz) => ({
  type,
  uuid,
  headerColor: new Color(255, 0, 125),
  size: [400, 200],
  xyz,
  body: {
    label: type,
    module: null,
    entryPoint: "vs",
    buffers: [],
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

type Props = PanelProps<GPUVertexState>;
const VertexStatePanel: FC<Props> = ({ uuid, body }) => {
  const { dispatch } = useContext(NodeContext);
  const { addAttribute, newLayout } = VertexStateUtils;

  const [layouts, setLayouts] = useState<GPUVertexBufferLayout[]>([
    ...body.buffers,
  ]);

  const handleAddLayout = (evt: React.MouseEvent) => {
    evt.preventDefault();

    const newLayouts = [...layouts, newLayout()];
    setLayouts(newLayouts);
  };

  const handleAddAttribute = (evt: React.MouseEvent, index: number) => {
    evt.preventDefault();
    const newLayouts = layouts.map((layout: GPUVertexBufferLayout, i) =>
      i === index ? { ...addAttribute(layout) } : { ...layout }
    );

    setLayouts(newLayouts);
    const newBody: GPUVertexState = { ...body, buffers: newLayouts };
    dispatch({ type: "EDIT_NODE_BODY", payload: { uuid, body: newBody } });
  };

  const handleEditAttribute =
    (layoutIndex: n, attributeIndex: n) => (evt: React.ChangeEvent) => {
      const key = (evt.target as HTMLElement).dataset["key"];
      const value = (evt.target as HTMLInputElement).value;
      layouts[layoutIndex].attributes[attributeIndex][key] = value;

      const newBody: GPUVertexState = { ...body, buffers: [...layouts] };
      setLayouts([...layouts]);
      dispatch({ type: "EDIT_NODE_BODY", payload: { uuid, body: newBody } });
    };

  const handleEditArrayStride = (evt: React.ChangeEvent, index: n) => {
    const value = (evt.target as HTMLInputElement).value;
    const arrayStride = parseInt(value);

    const buffers = [...layouts];
    buffers[index].arrayStride = isNaN(arrayStride) ? 0 : arrayStride;
    const newBody: GPUVertexState = { ...body, buffers };

    setLayouts(buffers);
    dispatch({ type: "EDIT_NODE_BODY", payload: { uuid, body: newBody } });
  };

  return (
    <div className="input-container vertex-state-panel">
      <div className="buffers">
        {layouts.map((layout, i: number) => (
          <BufferLayout
            layout={layout}
            index={i}
            key={i}
            handleEditArrayStride={handleEditArrayStride}
            handleEditAttribute={handleEditAttribute}
            handleAddAttribute={handleAddAttribute}
          />
        ))}
      </div>
      <button onClick={handleAddLayout}>Add layout</button>
    </div>
  );
};

type AttributeProps = {
  attribute: GPUVertexAttribute;
  index: number;
  handleEdit: (evt: React.ChangeEvent) => void;
};
const Attribute: FC<AttributeProps> = ({ attribute, index, handleEdit }) => {
  return (
    <div className="attribute col" key={index}>
      <div className="labels row">
        <label>Location</label>
        <label>Offset</label>
        <label>Format</label>
      </div>
      <div className="values row">
        <input
          onChange={handleEdit}
          type="number"
          value={attribute.shaderLocation}
          data-key={"shaderLocation"}
        />
        <input
          onChange={handleEdit}
          type="number"
          value={attribute.offset}
          data-key={"offset"}
        />
        <select
          onChange={handleEdit}
          value={attribute.format}
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

type BufferLayoutProps = {
  layout: GPUVertexBufferLayout;
  index: number;
  handleEditArrayStride: (evt: React.ChangeEvent, index: n) => void;
  handleEditAttribute: (
    layoutIndex: n,
    attributeIndex: n
  ) => (evt: React.ChangeEvent) => void;
  handleAddAttribute: (evt: React.MouseEvent, index: n) => void;
};
const BufferLayout: FC<BufferLayoutProps> = ({
  layout,
  index,
  handleEditArrayStride,
  handleEditAttribute,
  handleAddAttribute,
}) => {
  return (
    <div className="buffer">
      <div>Layout</div>
      <div className="attributes">
        <label>Array Stride:</label>
        <input
          type="number"
          value={layout.arrayStride}
          onChange={(evt) => handleEditArrayStride(evt, index)}
        />
        <label>Attributes:</label>
        {(layout.attributes as Array<GPUVertexAttribute>).map(
          (attr, i: number) => (
            <Attribute
              attribute={attr}
              index={i}
              key={i}
              handleEdit={handleEditAttribute(index, i)}
            />
          )
        )}
        <button onClick={(evt) => handleAddAttribute(evt, index)}>
          Add Attribute
        </button>
      </div>
    </div>
  );
};

const VertexStateUtils = {
  newLayout: (): GPUVertexBufferLayout => ({
    arrayStride: 4 * 4,
    attributes: [{ shaderLocation: 0, offset: 0, format: "float32x4" }],
  }),
  addAttribute: (layout: GPUVertexBufferLayout): GPUVertexBufferLayout => ({
    arrayStride: layout.arrayStride * 4,
    attributes: [
      ...layout.attributes,
      {
        shaderLocation: (layout.attributes as Array<GPUVertexAttribute>).length,
        offset: 0,
        format: "float32x4",
      },
    ],
  }),
};

export { VertexStatePanel, VertexStateInit, VertexStateUtils };
