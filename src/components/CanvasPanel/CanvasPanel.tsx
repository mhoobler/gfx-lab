import React, {FC, useEffect, useRef} from "react";

type Props = PanelProps<GPUCanvasPanel>;

const CanvasPanel: FC<Props> = ({ body }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if(canvasRef.current && !body.canvas) {
      body.canvas = canvasRef.current;
      body.ctx = body.canvas.getContext("webgpu"); 
    }
  }, [body]);

  return (
    <canvas ref={canvasRef} width={200} height={180}>
    </canvas>
  );
}

export default CanvasPanel;
