import { Receiver } from "components";
import { Color, Node } from "data";
import { FC } from "react";

export type DrawCallData = Node.Data<GPUDrawCall, Node.Receivers<"Buffer" | "RenderPipeline">>;
const type = "DrawCall";
const DrawCallInit: Node.InitFn<DrawCallData> = (
  uuid,
  xyz
) => ({
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
  receivers: {
    RenderPipeline: [
      {
        uuid,
        type: "RenderPipeline",
        from: null,
      },
    ],
    Buffer: [
      {
        uuid,
        type: "Buffer",
        from: null,
      },
    ],
  },
});

const DrawCallJson = (body: GPUDrawCall) => {
  const { label } = body;
  return { label }
}

type Props = PanelProps<DrawCallData>;
const DrawCallPanel: FC<Props> = ({ data }) => {
  const renderPipelineReceiver = data.receivers["RenderPipeline"][0];
  const bufferReceivers = data.receivers["Buffer"];
  return (
    <div className="input-container draw-call-panel">
      <Receiver receiver={renderPipelineReceiver} index={0}>
        {renderPipelineReceiver.type}
      </Receiver>
      {bufferReceivers.map((receiver, index) => (
        <Receiver key={data.uuid + index} receiver={receiver} index={index}>
          {receiver.type}
        </Receiver>
      ))}
      <div>
        <button>Add Buffer</button>
      </div>
    </div>
  );
};

export { DrawCallPanel, DrawCallInit, DrawCallJson };
