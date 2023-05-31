import { Color } from "data";
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
    buffer: null,
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
    {
      uuid,
      type: "Buffer",
      from: null,
    },
  ],
});

type Props = PanelProps<GPUDrawCall>;
const DrawCallPanel: FC<Props> = () => {
  return (
    <div className="input-container draw-call-panel">
      <div>
        <button>Add Buffer</button>
      </div>
    </div>
  );
};

export { DrawCallPanel, DrawCallInit };
