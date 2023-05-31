import { FC } from "react";

import { BufferPanel } from "../BufferPanel/BufferPanel";
import { CanvasPanel } from "../CanvasPanel/CanvasPanel";
import { CommandEncoderPanel } from "../CommandEncoderPanel/CommandEncoderPanel";
import { DataPanel } from "../DataPanel/DataPanel";
import { DrawCallPanel } from "../DrawCallPanel/DrawCallPanel";
import { FragmentStatePanel } from "../FragmentStatePanel/FragmentStatePanel";
import { RenderPassPanel } from "../RenderPassPanel/RenderPassPanel";
import { RenderPipelinePanel } from "../RenderPipelinePanel/RenderPipelinePanel";
import { ShaderModulePanel } from "../ShaderModulePanel/ShaderModulePanel";
import { VertexStatePanel } from "../VertexStatePanel/VertexStatePanel";

type Props = { data: NodeData<GPUBase> };
const Panel: FC<Props> = ({ data }) => {
  switch (data.type) {
    case "Buffer": {
      return (
        <BufferPanel uuid={data.uuid} body={data.body as GPUBufferDescriptor}>
          <></>
        </BufferPanel>
      );
    }
    case "CanvasPanel": {
      return (
        <CanvasPanel uuid={data.uuid} body={data.body as GPUCanvasPanel}>
          <></>
        </CanvasPanel>
      );
    }
    case "CommandEncoder": {
      return (
        <CommandEncoderPanel
          uuid={data.uuid}
          body={data.body as GPUCommandEncoderDescriptorEXT}
        >
          <></>
        </CommandEncoderPanel>
      );
    }
    case "Data": {
      return (
        <DataPanel uuid={data.uuid} body={data.body as GPUData}>
          <></>
        </DataPanel>
      );
    }
    case "DrawCall": {
      return (
        <DrawCallPanel uuid={data.uuid} body={data.body as GPUDrawCall}>
          <></>
        </DrawCallPanel>
      );
    }
    case "FragmentState": {
      return (
        <FragmentStatePanel
          uuid={data.uuid}
          body={data.body as GPUFragmentState}
        >
          <></>
        </FragmentStatePanel>
      );
    }
    case "RenderPass": {
      return (
        <RenderPassPanel
          uuid={data.uuid}
          body={data.body as GPURenderPassDescriptorEXT}
        >
          <></>
        </RenderPassPanel>
      );
    }
    case "RenderPipeline": {
      return (
        <RenderPipelinePanel
          uuid={data.uuid}
          body={data.body as GPURenderPipelineDescriptor}
        >
          <></>
        </RenderPipelinePanel>
      );
    }
    case "ShaderModule": {
      return (
        <ShaderModulePanel
          uuid={data.uuid}
          body={data.body as GPUShaderModuleDescriptor}
        >
          <></>
        </ShaderModulePanel>
      );
    }
    case "VertexState": {
      return (
        <VertexStatePanel uuid={data.uuid} body={data.body as GPUVertexState}>
          <></>
        </VertexStatePanel>
      );
    }
    default: {
      (() => {
        console.error("Node.tsx fallthrough case");
        return <div></div>;
      })();
    }
  }
};

export default Panel;
