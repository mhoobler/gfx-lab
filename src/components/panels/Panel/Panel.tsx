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
import { VertexBufferLayoutPanel } from "../VertexBufferLayoutPanel/VertexBufferLayoutPanel";
import {VertexAttributePanel} from "../VertexAttributePanel/VertexAttributePanel";

type Props = { data: NodeData<GPUBase, NodeType> };
const Panel: FC<Props> = ({ data }) => {
  switch (data.type) {
    case "Buffer": {
      return (
        <BufferPanel data={data as NodeData<GPUBufferDescriptor, "Data">}>
          <></>
        </BufferPanel>
      );
    }
    case "CanvasPanel": {
      return (
        <CanvasPanel data={data as NodeData<GPUCanvasPanel, null>}>
          <></>
        </CanvasPanel>
      );
    }
    case "CommandEncoder": {
      return (
        <CommandEncoderPanel
          data={
            data as NodeData<
              GPUCommandEncoderDescriptorEXT,
              "RenderPass" | "DrawCall"
            >
          }
        >
          <></>
        </CommandEncoderPanel>
      );
    }
    case "Data": {
      return (
        <DataPanel data={data as NodeData<GPUData, null>}>
          <></>
        </DataPanel>
      );
    }
    case "DrawCall": {
      return (
        <DrawCallPanel
          data={data as NodeData<GPUDrawCall, "RenderPipeline" | "Buffer">}
        >
          <></>
        </DrawCallPanel>
      );
    }
    case "FragmentState": {
      return (
        <FragmentStatePanel
          data={data as NodeData<GPUFragmentState, "ShaderModule">}
        >
          <></>
        </FragmentStatePanel>
      );
    }
    case "RenderPass": {
      return (
        <RenderPassPanel
          data={data as NodeData<GPURenderPassDescriptorEXT, "CanvasPanel">}
        >
          <></>
        </RenderPassPanel>
      );
    }
    case "RenderPipeline": {
      return (
        <RenderPipelinePanel
          data={
            data as NodeData<
              GPURenderPipelineDescriptor,
              "VertexState" | "FragmentState"
            >
          }
        >
          <></>
        </RenderPipelinePanel>
      );
    }
    case "ShaderModule": {
      return (
        <ShaderModulePanel
          data={data as NodeData<GPUShaderModuleDescriptor, null>}
        >
          <></>
        </ShaderModulePanel>
      );
    }
    case "VertexState": {
      return (
        <VertexStatePanel
          data={
            data as NodeData<
              GPUVertexState,
              "ShaderModule" | "VertexBufferLayout"
            >
          }
        >
          <></>
        </VertexStatePanel>
      );
    }
    case "VertexBufferLayout": {
      return (
        <VertexBufferLayoutPanel
          data={data as NodeData<GPUVertexBufferLayoutEXT, "VertexAttribute">}
        >
          <></>
        </VertexBufferLayoutPanel>
      );
    }
    case "VertexAttribute": {
      return (
        <VertexAttributePanel
          data={data as NodeData<GPUVertexAttributeEXT, null>}
        >
          <></>
        </VertexAttributePanel>
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
