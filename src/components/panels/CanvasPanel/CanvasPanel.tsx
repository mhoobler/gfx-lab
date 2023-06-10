import { Color, Node } from "data";
import { FC, useContext, useEffect, useRef } from "react";
import { WgpuContext } from "wgpu";

import "./CanvasPanel.less";

export type CanvasPanelData = Node.Data<GPUCanvasPanel>;
const type = "CanvasPanel";
const CanvasPanelInit: Node.InitFn<CanvasPanelData> = (uuid, xyz) => ({
  type,
  headerColor: new Color(255, 255, 255),
  uuid,
  size: [200, 200],
  xyz,
  body: {
    label: type,
    canvas: null,
    ctx: null,
    createView: null,
  },
  sender: {
    uuid,
    type,
    value: null,
    to: new Set(),
  },
  receivers: null,
});

const CanvasPanelJson = (body: GPUCanvasPanel) => {
  const { label } = body;
  return { label }
}

type Props = PanelProps<CanvasPanelData>;
const CanvasPanel: FC<Props> = ({ data }) => {
  const { device, format } = useContext(WgpuContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { body } = data;

  useEffect(() => {
    if (canvasRef.current && !body.canvas) {
      const bb = canvasRef.current.parentElement.getBoundingClientRect();
      canvasRef.current.width = bb.width;
      canvasRef.current.height = bb.height;

      const ctx = canvasRef.current.getContext("webgpu");
      if (ctx) {
        ctx.configure({
          device: device,
          format: format,
        });
        body.canvas = canvasRef.current;
        body.ctx = ctx;
        body.createView = () => ctx.getCurrentTexture().createView();
      }
    }
  }, [body]);

  return (
    <div className="input-container">
      <canvas ref={canvasRef} width={142} height={170}></canvas>
    </div>
  );
};

export { CanvasPanel, CanvasPanelInit, CanvasPanelJson };
