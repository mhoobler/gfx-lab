import { Color } from "../../data";
import React, { FC } from "react";

const type = "RenderPipeline";
const RenderPipelineInit: NodeInitFn<GPURenderPipelineDescriptor> = (
  uuid,
  xyz
) => ({
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
  receivers: [
    {
      uuid,
      type: "VertexState",
      from: null,
    },
    {
      uuid,
      type: "FragmentState",
      from: null,
    },
  ],
});

type Props = PanelProps<GPURenderPipelineDescriptor>;
const RenderPipelinePanel: FC<Props> = () => {
  return (
    <>
      <div>RenderPipelinePanel</div>
    </>
  );
};
export { RenderPipelinePanel, RenderPipelineInit };
