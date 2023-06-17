import { NodeContext, Receiver } from "components";
import { Color, Node } from "data";
import { FC, useContext, useEffect, useState } from "react";

export type RenderPassData = Node.Data<
  GPURenderPassDescriptorEXT,
  Node.Receivers<"CanvasPanel" | "Buffer" | "RenderPipeline" | "DrawCall">
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
  const [receiversOrder, setReceiversOrder] = useState(body.receiversOrder);
  const [showSelection, setShowSelection] = useState(0);

  useEffect(() => {
    const hideSelection = () => {
      setShowSelection((state) => {
        if (state === 0) {
          return 0;
        }
        return (state + 1) % 3;
      });
    };
    window.addEventListener("click", hideSelection);

    return () => window.removeEventListener("click", hideSelection);
  }, [showSelection]);

  const handleBufferChange = (
    evt: React.ChangeEvent<HTMLInputElement>,
    receiverIndex: number
  ) => {
    const value = evt.target.value;
    let int = parseInt(value);

    if (isNaN(int)) {
      int = 0;
    }

    body.receiversOrder[receiverIndex].value = int;
    dispatch({ type: "EDIT_NODE_BODY", payload: { uuid, body } });

    setReceiversOrder((state) => {
      const newOrder = [...state];
      newOrder[receiverIndex].value = int;
      return newOrder;
    });
  };

  const handleDeleteReceiver = (receiverIndex: number) => {
    const { type, index } = body.receiversOrder[receiverIndex];

    dispatch({
      type: "DELETE_RECEIVER",
      payload: { uuid, type, index },
    });

    setReceiversOrder((state) => {
      return state.filter((_, index) => index !== receiverIndex);
    });
  };

  const handleAddReceiver = (type: Node.Type) => {
    const receiver = { uuid, type, from: null };
    console.log(data.receivers[type]);
    const index = data.receivers[type].length;
    body.receiversOrder.push({ type, uuid: null, value: null, index });

    dispatch({
      type: "ADD_RENDERPASS_STEP",
      payload: { receiver, index, body },
    });
  };

  console.log(receiversOrder);
  return (
    <div className="input-container">
      {receiversOrder.map(({ type, index, value, uuid }, receiverIndex) => {
        const receiver = data.receivers[type][index];
        return (
          <Receiver
            key={data.uuid + receiver.type + index}
            receiver={receiver}
            index={index}
            handleDelete={() => handleDeleteReceiver(receiverIndex)}
          >
            {receiver.type}
            {type === "Buffer" ? (
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
      {showSelection > 0 ? (
        <div className="col">
          <button onClick={() => handleAddReceiver("DrawCall")}>
            DrawCall
          </button>
          <button onClick={() => handleAddReceiver("RenderPipeline")}>
            RenderPipeline
          </button>
          <button onClick={() => handleAddReceiver("CanvasPanel")}>
            CanvasPanel
          </button>
          <button onClick={() => handleAddReceiver("Buffer")}>Buffer</button>
        </div>
      ) : (
        <button onClick={() => setShowSelection(1)}>Add Step</button>
      )}
    </div>
  );
};
export { RenderPassPanel, RenderPassInit, RenderPassJson };
