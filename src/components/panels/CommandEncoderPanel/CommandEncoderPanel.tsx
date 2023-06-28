import { FC, useContext, MouseEvent } from "react";

import { Color, Node } from "data";
import { NodeContext, Receiver } from "components";

export type CommandEncoderData = Node.Data<
  GPUCommandEncoderDescriptorEXT,
  Node.Receivers<"RenderPass">
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
  },
});

const CommandEncoderJson = (body: GPUCommandEncoderDescriptorEXT) => {
  const { label } = body;
  return { label };
};

type Props = PanelProps<CommandEncoderData>;
const CommandEncoderPanel: FC<Props> = ({ data }) => {
  const { dispatch } = useContext(NodeContext);

  const handleAddRenderPass = (e: MouseEvent) => {
    e.preventDefault();
    const receiver = { uuid: data.uuid, type: "RenderPass", from: null };
    const index = data.receivers["RenderPass"].length;
    dispatch({ type: "ADD_RECEIVER", payload: { index, receiver } });
  };

  const renderPassReceivers = data.receivers["RenderPass"];

  return (
    <>
      <div className="input-container">
        {renderPassReceivers.map((receiver, index) => (
          <Receiver key={data.uuid} receiver={receiver} index={index}>
            {receiver.type}
          </Receiver>
        ))}
        <button onClick={handleAddRenderPass}>Add Draw Call</button>
      </div>
    </>
  );
};

export { CommandEncoderPanel, CommandEncoderInit, CommandEncoderJson };
