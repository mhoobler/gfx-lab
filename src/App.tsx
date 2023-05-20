import React, { useContext, useEffect, useRef, useState } from "react";
import { WgpuContext } from "./wgpu";

const App: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState<number>(0);

  const { device, format } = useContext(WgpuContext);

  useEffect(() => {
    if (canvas.current && device && format) {
      const ctx = canvas.current.getContext("webgpu");
      ctx.configure({
        device,
        format,
      });

      const module = device.createShaderModule({
        label: "our hardcoded red triangle shaders",
        code: `
        @vertex fn vs(
          @builtin(vertex_index) vertexIndex : u32
        ) -> @builtin(position) vec4f {
          var pos = array<vec2f, 3>(
            vec2f( 0.0,  0.5),  // top center
            vec2f(-0.5, -0.5),  // bottom left
            vec2f( 0.5, -0.5)   // bottom right
          );
   
          return vec4f(pos[vertexIndex], 0.0, 1.0);
        }
   
        @fragment fn fs() -> @location(0) vec4f {
          return vec4f(1.0, 0.0, 0.0, 1.0);
        }
      `,
      });

      const pipeline = device.createRenderPipeline({
        label: "our hardcoded red triangle pipeline",
        layout: "auto",
        vertex: {
          module,
          entryPoint: "vs",
        },
        fragment: {
          module,
          entryPoint: "fs",
          targets: [{ format }],
        },
        primitive: {
          topology: "triangle-strip"
        }

      });

      const renderPassDescriptor: GPURenderPassDescriptor = {
        label: "our basic canvas renderPass",
        colorAttachments: [
          {
            view: undefined,
            clearValue: [0.0, 0.0, 0.3, 1],
            loadOp: "clear",
            storeOp: "store",
          },
        ],
      };

      // Get the current texture from the canvas context and
      // set it as the texture to render to.
      renderPassDescriptor.colorAttachments[0].view = ctx
        .getCurrentTexture()
        .createView();

      // make a command encoder to start encoding commands
      const encoder = device.createCommandEncoder({ label: "our encoder" });

      // make a render pass encoder to encode render specific commands
      const pass = encoder.beginRenderPass(renderPassDescriptor);
      pass.setPipeline(pipeline);
      pass.draw(3); // call our vertex shader 3 times
      pass.end();

      const commandBuffer = encoder.finish();
      device.queue.submit([commandBuffer]);

      console.log("Canvas ready");
    }
  }, [device, format]);

  return (
    <div>
      <h1 onClick={() => setCount(count + 1)}>Hello World!</h1>
      <canvas ref={canvas}></canvas>
    </div>
  );
};

export default App;
