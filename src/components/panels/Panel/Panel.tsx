import { FC } from "react";

import { CanvasPanel } from "../CanvasPanel/CanvasPanel";
import { CommandEncoderPanel } from "../CommandEncoderPanel/CommandEncoderPanel";
import { DrawCallPanel } from "../DrawCallPanel/DrawCallPanel";
import { FragmentStatePanel } from "../FragmentStatePanel/FragmentStatePanel";
import { RenderPassPanel } from "../RenderPassPanel/RenderPassPanel";
import { RenderPipelinePanel } from "../RenderPipelinePanel/RenderPipelinePanel";
import { ShaderModulePanel } from "../ShaderModulePanel/ShaderModulePanel";
import { VertexStatePanel } from "../VertexStatePanel/VertexStatePanel";

type Props = { data: NodeData<GPUBase> };
const Panel: FC<Props> = ({ data }) => {
  return (
    <>
      {data.type === "ShaderModule" ? (
        <ShaderModulePanel
          uuid={data.uuid}
          body={data.body as GPUShaderModuleDescriptor}
        >
          <></>
        </ShaderModulePanel>
      ) : data.type === "VertexState" ? (
        <VertexStatePanel uuid={data.uuid} body={data.body as GPUVertexState}>
          <></>
        </VertexStatePanel>
      ) : data.type === "FragmentState" ? (
        <FragmentStatePanel
          uuid={data.uuid}
          body={data.body as GPUFragmentState}
        >
          <></>
        </FragmentStatePanel>
      ) : data.type === "RenderPipeline" ? (
        <RenderPipelinePanel
          uuid={data.uuid}
          body={data.body as GPURenderPipelineDescriptor}
        >
          <></>
        </RenderPipelinePanel>
      ) : data.type === "CanvasPanel" ? (
        <CanvasPanel uuid={data.uuid} body={data.body as GPUCanvasPanel}>
          <></>
        </CanvasPanel>
      ) : data.type === "CommandEncoder" ? (
        <CommandEncoderPanel
          uuid={data.uuid}
          body={data.body as GPUCommandEncoderDescriptorEXT}
        >
          <></>
        </CommandEncoderPanel>
      ) : data.type === "RenderPass" ? (
        <RenderPassPanel
          uuid={data.uuid}
          body={data.body as GPURenderPassDescriptorEXT}
        >
          <></>
        </RenderPassPanel>
      ) : data.type === "DrawCall" ? (
        <DrawCallPanel uuid={data.uuid} body={data.body as GPUDrawCall}>
          <></>
        </DrawCallPanel>
      ) : (
        (() => {
          console.error("Node.tsx fallthrough case");
          return <div></div>;
        })()
      )}
    </>
  );
};

export default Panel;
