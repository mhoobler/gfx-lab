import { NodeManager, NodeContext } from "components";
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

  let [layouts, setLayouts] = useState<GPUVertexBufferLayout[]>([
    ...body.buffers,
  ]);

  const handleAddLayout = (evt: React.MouseEvent) => {
    evt.preventDefault();
    setLayouts((state) => [...state, newLayout()]);
  };

  const handleAddAttribute = (evt: React.MouseEvent, index: number) => {
    evt.preventDefault();
    setLayouts((state) =>
      state.map((layout: GPUVertexBufferLayout, i) =>
        i === index ? { ...addAttribute(layout) } : { ...layout }
      )
    );
  };

  const handleEditAttribute =
    (layoutIndex: n, attributeIndex: n) => (evt: React.ChangeEvent) => {
      let key = (evt.target as HTMLElement).dataset["key"];
      let value = (evt.target as HTMLInputElement).value;
      layouts[layoutIndex].attributes[attributeIndex][key] = value;

      let newBody: GPUVertexState = { ...body, buffers: [...layouts] };
      dispatch({ type: "EDIT_NODE_BODY", payload: { uuid, body: newBody } });
    };

  const handleEditArrayStride = (evt: React.ChangeEvent, index: n) => {
    let value = (evt.target as HTMLInputElement).value;

    let buffers = [...layouts];
    buffers[index].arrayStride = parseInt(value);
    let newBody: GPUVertexState = { ...body, buffers };
    dispatch({ type: "EDIT_NODE_BODY", payload: { uuid, body: newBody } });
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

  type BufferLayoutProps = { layout: GPUVertexBufferLayout; index: number };
  const BufferLayout: FC<BufferLayoutProps> = ({ layout, index }) => {
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
          {(layout.attributes as Array<any>).map((attr, i: number) => (
            <Attribute
              attribute={attr}
              index={i}
              key={i}
              handleEdit={handleEditAttribute(index, i)}
            />
          ))}
          <button onClick={(evt) => handleAddAttribute(evt, index)}>
            Add Attribute
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="input-container vertex-state-panel">
      <div className="buffers">
        {layouts.map((layout, i: number) => (
          <BufferLayout layout={layout} index={i} key={i} />
        ))}
      </div>
      <button onClick={handleAddLayout}>Add layout</button>
    </div>
  );
};

namespace VertexStateUtils {
  export const newLayout = (): GPUVertexBufferLayout => ({
    arrayStride: 4 * 4,
    attributes: [{ shaderLocation: 0, offset: 0, format: "float32x4" }],
  });

  export const addAttribute = (
    layout: GPUVertexBufferLayout
  ): GPUVertexBufferLayout => ({
    arrayStride: layout.arrayStride * 4,
    attributes: [
      ...layout.attributes,
      {
        shaderLocation: (layout.attributes as Array<any>).length,
        offset: 0,
        format: "float32x4",
      },
    ],
  });
}

export { VertexStatePanel, VertexStateInit, VertexStateUtils };
