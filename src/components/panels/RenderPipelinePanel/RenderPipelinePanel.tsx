import { Receiver2 } from "components";
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

type Props = PanelProps2<
  GPURenderPipelineDescriptor,
  "VertexState" | "FragmentState"
>;
const RenderPipelinePanel: FC<Props> = ({ data }) => {
  const { receivers } = data;

  const vertexStateReceiver = receivers["VertexState"][0];
  const fragmentStateReceiver = receivers["FragmentState"][0];

  return (
    <div className="input-container">
      <Receiver2 receiver={vertexStateReceiver} index={0}>
        {vertexStateReceiver.type}
      </Receiver2>
      <Receiver2 receiver={fragmentStateReceiver} index={0}>
        {fragmentStateReceiver.type}
      </Receiver2>
    </div>
  );
};
export { RenderPipelinePanel, RenderPipelineInit };
