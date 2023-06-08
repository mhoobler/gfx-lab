import { Receiver2 } from "components";
import { Color } from "data";
import { FC } from "react";

const type = "DrawCall";
const DrawCallInit: NodeInitFn<GPUDrawCall, "Buffer" | "RenderPipeline"> = (
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

type Props = PanelProps2<GPUDrawCall, "RenderPipeline" | "Buffer">;
const DrawCallPanel: FC<Props> = ({ data }) => {
  const renderPipelineReceiver = data.receivers["RenderPipeline"][0];
  const bufferReceivers = data.receivers["Buffer"];
  return (
    <div className="input-container draw-call-panel">
      <Receiver2 receiver={renderPipelineReceiver} index={0}>
        {renderPipelineReceiver.type}
      </Receiver2>
      {bufferReceivers.map((receiver, index) => (
        <Receiver2 key={data.uuid + index} receiver={receiver} index={index}>
          {receiver.type}
        </Receiver2>
      ))}
      <div>
        <button>Add Buffer</button>
      </div>
    </div>
  );
};

export { DrawCallPanel, DrawCallInit, DrawCallJson };
