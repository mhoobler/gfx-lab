import { FC, useContext, MouseEvent } from "react";

import { Color } from "data";
import { NodeContext, Receiver2 } from "components";

const type = "CommandEncoder";
const CommandEncoderInit: NodeInitFn<
  GPUCommandEncoderDescriptorEXT,
  "RenderPass" | "DrawCall"
> = (uuid, xyz) => ({
  type,
  uuid,
  headerColor: Color.Sage,
  size: [200, 200],
  xyz,
  body: {
    label: type,
    renderPassDesc: null,
    drawCall: [],
  },
  sender: {
    uuid,
    type,
    value: null,
    to: new Set(),
  },
  receivers: {
    RenderPass: [
      {
        uuid,
        type: "RenderPass",
        from: null,
      },
    ],
    DrawCall: [
      {
        uuid,
        type: "DrawCall",
        from: null,
      },
    ],
  },
});

type Props = PanelProps2<
  GPUCommandEncoderDescriptorEXT,
  "RenderPass" | "DrawCall"
>;
const CommandEncoderPanel: FC<Props> = ({ data }) => {
  const { dispatch } = useContext(NodeContext);

  const handleAddDrawCall = (e: MouseEvent) => {
    e.preventDefault();
    const receiver = { uuid: data.uuid, type: "DrawCall", from: null };
    const index = data.receivers["DrawCall"].length;
    dispatch({ type: "ADD_RECEIVER", payload: { index, receiver } });
  };

  const renderPassReceiver = data.receivers["RenderPass"][0];
  const drawCallReceivers = data.receivers["DrawCall"];

  return (
    <>
      <div className="input-container">
        <Receiver2 key={data.uuid} receiver={renderPassReceiver} index={0}>
          {renderPassReceiver.type}
        </Receiver2>
        {drawCallReceivers.map((receiver, index) => (
          <Receiver2 key={data.uuid + index} receiver={receiver} index={index}>
            {receiver.type}
          </Receiver2>
        ))}
        <button onClick={handleAddDrawCall}>Add Draw Call</button>
        <button onClick={handleAddDrawCall}>Add Draw Call</button>
      </div>
    </>
  );
};

export { CommandEncoderPanel, CommandEncoderInit };
