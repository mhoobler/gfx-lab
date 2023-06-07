import { Receiver2 } from "components";
import { Color } from "data";
import { FC } from "react";

const type = "RenderPass";
const RenderPassInit: NodeInitFn<GPURenderPassDescriptorEXT, "CanvasPanel"> = (
  uuid,
  xyz
) => ({
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
  },
});

type Props = PanelProps2<GPURenderPassDescriptorEXT, "CanvasPanel">;
const RenderPassPanel: FC<Props> = ({ data }) => {
  const canvasPanelReceiver = data.receivers["CanvasPanel"][0];

  return (
    <div className="input-container">
      <Receiver2 receiver={canvasPanelReceiver} index={0}>
        {canvasPanelReceiver.type}
      </Receiver2>
    </div>
  );
};
export { RenderPassPanel, RenderPassInit };
