import { Receiver } from "components";
import { Color, Node } from "data";
import { FC } from "react";

export type RenderPassData = Node.Data<GPURenderPassDescriptorEXT, Node.Receivers<"CanvasPanel">>;
const type = "RenderPass";
const RenderPassInit: Node.InitFn<RenderPassData> = (
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

const RenderPassJson = (body: GPURenderPassDescriptorEXT) => {
  const { label } = body;
  return { label }
}

type Props = PanelProps2<RenderPassData>;
const RenderPassPanel: FC<Props> = ({ data }) => {
  const canvasPanelReceiver = data.receivers["CanvasPanel"][0];

  return (
    <div className="input-container">
      <Receiver receiver={canvasPanelReceiver} index={0}>
        {canvasPanelReceiver.type}
      </Receiver>
    </div>
  );
};
export { RenderPassPanel, RenderPassInit, RenderPassJson };
