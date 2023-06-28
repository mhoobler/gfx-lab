import { Receiver } from "components";
import { Color, Node } from "data";
import { FC } from "react";

export type RenderPipelineData = Node.Data<
  GPURenderPipelineDescriptor,
  Node.Receivers<"VertexState" | "FragmentState">
>;
const type = "RenderPipeline";
const RenderPipelineInit: Node.InitFn<RenderPipelineData> = (uuid, xyz) => ({
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
    layoutIndex: 0,
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

const RenderPipelineJson = (body: GPURenderPipelineDescriptor) => {
  const { label, primitive } = body;
  return { label, primitive };
};

type Props = PanelProps<RenderPipelineData>;
const RenderPipelinePanel: FC<Props> = ({ data }) => {
  const { receivers } = data;

  const vertexStateReceiver = receivers["VertexState"][0];
  const fragmentStateReceiver = receivers["FragmentState"][0];

  return (
    <div className="input-container">
      <Receiver receiver={vertexStateReceiver} index={0}>
        {vertexStateReceiver.type}
      </Receiver>
      <Receiver receiver={fragmentStateReceiver} index={0}>
        {fragmentStateReceiver.type}
      </Receiver>
    </div>
  );
};
export { RenderPipelinePanel, RenderPipelineInit, RenderPipelineJson };
