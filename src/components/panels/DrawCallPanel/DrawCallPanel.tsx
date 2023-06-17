import { Color, Node } from "data";
import { FC } from "react";

export type DrawCallData = Node.Data<GPUDrawCall, Node.Receivers<null>>;
const type = "DrawCall";
const DrawCallInit: Node.InitFn<DrawCallData> = (uuid, xyz) => ({
  type,
  headerColor: Color.Maroon,
  uuid,
  size: [200, 200],
  xyz,
  body: {
    label: type,
    vertexCount: 3,
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
  const { label } = body;
  return { label };
};

type Props = PanelProps<DrawCallData>;
const DrawCallPanel: FC<Props> = ({ data }) => {
  return <div className="input-container draw-call-panel">DrawCall</div>;
};

export { DrawCallPanel, DrawCallInit, DrawCallJson };
