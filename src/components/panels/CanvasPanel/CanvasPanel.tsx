import { Color } from "data";
import { FC, useEffect, useRef } from "react";

const type = "CanvasPanel";
const CanvasPanelInit: NodeInitFn<GPUCanvasPanel> = (uuid, xyz) => ({
  type,
  headerColor: new Color(255, 255, 255),
  uuid,
  size: [200, 200],
  xyz,
  body: {
    label: type,
    canvas: null,
    ctx: null,
  },
  sender: {
    uuid,
    type,
    value: null,
    to: new Set(),
  },
  receivers: null,
});

type Props = PanelProps<GPUCanvasPanel>;
const CanvasPanel: FC<Props> = ({ body }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && !body.canvas) {
      body.canvas = canvasRef.current;
      body.ctx = body.canvas.getContext("webgpu");
    }
  }, [body]);

  return (
    <div className="input-container">
      <canvas ref={canvasRef} width={142} height={170}></canvas>
    </div>
  );
};

export { CanvasPanel, CanvasPanelInit };
