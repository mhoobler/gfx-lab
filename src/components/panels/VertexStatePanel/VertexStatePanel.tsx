import { Color } from "data";
import { FC } from "react";

const type = "VertexState";
const VertexStateInit: NodeInitFn<GPUVertexState> = (uuid, xyz) => ({
  type,
  uuid,
  headerColor: new Color(255, 0, 125),
  size: [200, 200],
  xyz,
  body: {
    label: type,
    module: null,
    entryPoint: "vs",
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
const VertexStatePanel: FC<Props> = () => {
  return <div>VertexStatePanel</div>;
};

export { VertexStatePanel, VertexStateInit };
