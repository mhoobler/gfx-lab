import { Color } from "data";
import { FC } from "react";

const type = "RenderPipeline";
const RenderPipelineInit: NodeInitFn<
  GPURenderPipelineDescriptor,
  "VertexState" | "FragmentState"
> = (uuid, xyz) => ({
  type,
  headerColor: new Color(0, 0, 255),
  uuid,
  size: [200, 200],
  xyz,
  body: {
    label: type,
    layout: "auto",
    vertex: null,
    fragment: null,
    primitive: {
      topology: "triangle-strip",
    },
  },
  sender: {
    uuid,
    type,
    value: null,
    to: new Set(),
  },
  receivers: {
    VertexState: [
      {
        uuid,
        type: "VertexState",
        from: null,
      },
    ],
    FragmentState: [
      {
        uuid,
        type: "FragmentState",
        from: null,
      },
    ],
  },
});

type Props = PanelProps<GPURenderPipelineDescriptor>;
const RenderPipelinePanel: FC<Props> = () => {
  return <div className="input-container">RenderPipelinePanel</div>;
};
export { RenderPipelinePanel, RenderPipelineInit };
