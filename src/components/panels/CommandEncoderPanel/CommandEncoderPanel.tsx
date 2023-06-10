import { FC, useContext, MouseEvent } from "react";

import { Color, Node } from "data";
import { NodeContext, Receiver } from "components";

export type CommandEncoderData = Node.Data<GPUCommandEncoderDescriptorEXT, 
  Node.Receivers<"RenderPass" | "DrawCall">
>;
const type = "CommandEncoder";
const CommandEncoderInit: Node.InitFn<CommandEncoderData> = (uuid, xyz) => ({
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

const CommandEncoderJson = (body: GPUCommandEncoderDescriptorEXT) => {
  const { label } = body;
  return { label }
}

type Props = PanelProps<CommandEncoderData>;
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
        <Receiver key={data.uuid} receiver={renderPassReceiver} index={0}>
          {renderPassReceiver.type}
        </Receiver>
        {drawCallReceivers.map((receiver, index) => (
          <Receiver key={data.uuid + index} receiver={receiver} index={index}>
            {receiver.type}
          </Receiver>
        ))}
        <button onClick={handleAddDrawCall}>Add Draw Call</button>
      </div>
    </>
  );
};

export { CommandEncoderPanel, CommandEncoderInit, CommandEncoderJson };
