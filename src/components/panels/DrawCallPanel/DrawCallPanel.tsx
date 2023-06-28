import { FC, useContext } from "react";
import { Color, Node } from "data";
import { NodeContext } from "components";

import "./DrawCallPanel.less";

export type DrawCallData = Node.Data<GPUDrawCall, Node.Receivers<null>>;
const type = "DrawCall";
const DrawCallInit: Node.InitFn<DrawCallData> = (uuid, xyz) => ({
  type,
  headerColor: Color.Maroon,
  uuid,
  size: [300, 200],
  xyz,
  body: {
    label: type,
    vertexCount: 3,
    instanceCount: 1,
  },
  sender: {
    uuid,
    type,
    value: null,
    to: new Set(),
  },
  receivers: null,
});

const DrawCallJson = (body: GPUDrawCall) => {
  const { label, vertexCount, instanceCount } = body;
  return { label, vertexCount, instanceCount };
};

type Props = PanelProps<DrawCallData>;
const DrawCallPanel: FC<Props> = ({ data }) => {
  const { dispatch } = useContext(NodeContext);
  const { body } = data;

  const handleEditVertexCount = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    let vertexCount = parseInt(value);
    if (isNaN(vertexCount)) {
      vertexCount = 0;
    }

    evt.target.value = vertexCount.toString();
    dispatch({
      type: "EDIT_NODE",
      payload: {
        ...data,
        body: {
          ...data.body,
          vertexCount,
        },
      },
    });
  };

  const handleEditInstanceCount = (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = evt.target.value;
    let instanceCount = parseInt(value);
    if (isNaN(instanceCount)) {
      instanceCount = 0;
    }

    evt.target.value = instanceCount.toString();
    dispatch({
      type: "EDIT_NODE",
      payload: {
        ...data,
        body: {
          ...data.body,
          instanceCount,
        },
      },
    });
  };

  return (
    <div className="input-container draw-call col">
      <div className="labels row">
        <label>Vertex Count</label>
        <label>Instance Count</label>
      </div>
      <div className="values row">
        <input
          type="number"
          value={body.vertexCount}
          onChange={handleEditVertexCount}
        />
        <input
          type="number"
          value={body.instanceCount}
          onChange={handleEditInstanceCount}
        />
      </div>
    </div>
  );
};

export { DrawCallPanel, DrawCallInit, DrawCallJson };
