import { FC, useContext } from "react";
import { Color, Node } from "data";
import { NodeContext, Receiver } from "components";

export type BindGroupData = Node.Data<
  GPUBindGroupDescriptorEXT,
  Node.Receivers<"RenderPipeline" | "BindGroupEntry">
>;
const type = "BindGroup";
const BindGroupInit: Node.InitFn<BindGroupData> = (uuid, xyz) => ({
  type,
  uuid,
  headerColor: new Color(0, 175, 200),
  size: [200, 200],
  xyz,
  body: {
    label: type,
    layout: null,
    entries: [],
    layoutIndex: null,
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
    BindGroupEntry: [],
  },
});

const BindGroupJson = (body: GPUBindGroupDescriptor & GPUBase) => {
  const { label } = body;
  return { label };
};

type Props = PanelProps<BindGroupData>;
const BindGroupPanel: FC<Props> = ({ data }) => {
  const { dispatch } = useContext(NodeContext);

  const renderPipelineReceiver = data.receivers.RenderPipeline[0];
  const bindGroupEntryReceivers = data.receivers.BindGroupEntry;

  const handleAddEntry = (evt: React.MouseEvent) => {
    const index = data.receivers.BindGroupEntry.length;
    const receiver = {
      uuid: data.uuid,
      type: "BindGroupEntry",
      from: null,
    };
    dispatch({
      type: "ADD_RECEIVER",
      payload: {
        index,
        receiver,
      },
    });
    evt.preventDefault();
  };

  return (
    <div className="input-container bind-group col">
      <Receiver receiver={renderPipelineReceiver} index={0}>
        {renderPipelineReceiver.type}
      </Receiver>
      {bindGroupEntryReceivers.map((receiver, index) => (
        <Receiver key={data.uuid + index} receiver={receiver} index={index}>
          {receiver.type}
        </Receiver>
      ))}
      <button onClick={handleAddEntry}>Add Entry</button>
    </div>
  );
};

export { BindGroupInit, BindGroupPanel, BindGroupJson };
