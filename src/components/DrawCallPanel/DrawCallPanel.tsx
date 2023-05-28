import { Color } from "../../data";
import { FC } from "react";

const type = "DrawCall";
const DrawCallInit: NodeInitFn<GPUDrawCall> = (uuid, xyz) => ({
  type,
  headerColor: Color.Maroon,
  uuid,
  size: [200, 200],
  xyz,
  body: {
    label: type,
    commandEncoderDesc: null,
    vertexCount: 3,
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
      type: "RenderPipeline",
      from: null,
    },
  ],
});

type Props = PanelProps<GPUDrawCall>;
const DrawCallPanel: FC<Props> = () => {
  return <div>DrawCallPanel</div>;
};

export { DrawCallPanel, DrawCallInit };
