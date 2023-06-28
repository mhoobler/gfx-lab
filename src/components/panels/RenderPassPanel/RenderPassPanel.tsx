import { NodeContext, Receiver, SelectionModal } from "components";
import { Color, Node } from "data";
import { FC, useContext, useEffect, useState } from "react";

export type RenderPassData = Node.Data<
  GPURenderPassDescriptorEXT,
  Node.Receivers<
    "CanvasPanel" | "Buffer" | "RenderPipeline" | "DrawCall" | "BindGroup"
  >
>;
const type = "RenderPass";
const RenderPassInit: Node.InitFn<RenderPassData> = (uuid, xyz) => ({
  type,
  headerColor: new Color(255, 200, 200),
  uuid,
  size: [200, 200],
  xyz,
  body: {
    label: type,
    colorAttachments: [
      {
        view: null,
        clearValue: [0.0, 0.0, 0.3, 1],
        loadOp: "clear",
        storeOp: "store",
      },
    ],
    canvasPointer: null,
    receiversOrder: [],
  },
  sender: {
    uuid,
    type,
    value: null,
    to: new Set(),
  },
  receivers: {
    CanvasPanel: [
      {
        uuid,
        type: "CanvasPanel",
        from: null,
      },
    ],
    Buffer: [],
    RenderPipeline: [],
    DrawCall: [],
    BindGroup: [],
  },
});

const RenderPassJson = (body: GPURenderPassDescriptorEXT) => {
  const { label, receiversOrder } = body;
  return { label, receiversOrder };
};

type Props = PanelProps<RenderPassData>;
const RenderPassPanel: FC<Props> = ({ data }) => {
  const { dispatch } = useContext(NodeContext);
  const { uuid, body } = data;
  const { receiversOrder } = body;

  const handleBufferChange = (
    evt: React.ChangeEvent<HTMLInputElement>,
    receiverIndex: number
  ) => {
    const value = evt.target.value;
    let int = parseInt(value);
    if (isNaN(int)) {
      int = 0;
    }

    const newOrder = [...receiversOrder];
    newOrder[receiverIndex].value = int;
    dispatch({
      type: "EDIT_NODE",
      payload: {
        ...data,
        body: {
          ...data.body,
          receiversOrder: newOrder,
        },
      },
    });
  };

  const handleDeleteReceiver = (receiverIndex: number) => {
    const { type, index } = body.receiversOrder[receiverIndex];
    const receiversOrder = body.receiversOrder.filter(
      (_, i) => i !== receiverIndex
    );
    const newReceivers = data.receivers[type].filter(
      (_: unknown, i: number) => i !== index
    );

    dispatch({
      type: "EDIT_NODE",
      payload: {
        ...data,
        body: {
          ...data.body,
          receiversOrder,
        },
        receivers: {
          ...data.receivers,
          [type]: newReceivers,
        },
      },
    });
  };

  const handleAddReceiver = (type: Node.Type) => {
    const receiver = { uuid, type, from: null };
    const index = data.receivers[type].length;

    const value = type === "Buffer" || type === "BindGroup" ? 0 : null;
    const newStep = { type, uuid: null, value, index };

    dispatch({
      type: "EDIT_NODE",
      payload: {
        ...data,
        body: {
          ...data.body,
          receiversOrder: [...body.receiversOrder, newStep],
        },
        receivers: {
          ...data.receivers,
          [type]: [...data.receivers[type], receiver],
        },
      },
    });
  };

  return (
    <div className="input-container">
      {receiversOrder.map(({ type, index, value }, receiverIndex) => {
        let receiver = data.receivers[type][index];
        if (!receiver) {
          receiver = {
            uuid,
            type,
            from: null,
          };
        }

        return (
          <Receiver
            key={data.uuid + receiver.type + index}
            receiver={receiver}
            index={index}
            handleDelete={() => handleDeleteReceiver(receiverIndex)}
          >
            {receiver.type}
            {type === "Buffer" || type === "BindGroup" ? (
              <input
                style={{ width: "2rem" }}
                value={value}
                onChange={(evt) => handleBufferChange(evt, receiverIndex)}
              />
            ) : (
              <></>
            )}
          </Receiver>
        );
      })}
      <SelectionModal
        items={[
          "DrawCall",
          "RenderPipeline",
          "CanvasPanel",
          "Buffer",
          "BindGroup",
        ]}
        handleSelect={handleAddReceiver}
      >
        Add Step
      </SelectionModal>
    </div>
  );
};
export { RenderPassPanel, RenderPassInit, RenderPassJson };
