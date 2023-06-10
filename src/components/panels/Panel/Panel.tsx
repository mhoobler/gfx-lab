import { FC } from "react";

import { Node } from "data";

import { BufferData, BufferPanel } from "../BufferPanel/BufferPanel";
import { CanvasPanel, CanvasPanelData } from "../CanvasPanel/CanvasPanel";
import {
  CommandEncoderData,
  CommandEncoderPanel,
} from "../CommandEncoderPanel/CommandEncoderPanel";
import { DataData, DataPanel } from "../DataPanel/DataPanel";
import { DrawCallData, DrawCallPanel } from "../DrawCallPanel/DrawCallPanel";
import {
  FragmentStateData,
  FragmentStatePanel,
} from "../FragmentStatePanel/FragmentStatePanel";
import {
  RenderPassData,
  RenderPassPanel,
} from "../RenderPassPanel/RenderPassPanel";
import {
  RenderPipelineData,
  RenderPipelinePanel,
} from "../RenderPipelinePanel/RenderPipelinePanel";
import {
  ShaderModuleData,
  ShaderModulePanel,
} from "../ShaderModulePanel/ShaderModulePanel";
import {
  VertexStateData,
  VertexStatePanel,
} from "../VertexStatePanel/VertexStatePanel";
import {
  VertexBufferLayoutData,
  VertexBufferLayoutPanel,
} from "../VertexBufferLayoutPanel/VertexBufferLayoutPanel";
import {
  VertexAttributeData,
  VertexAttributePanel,
} from "../VertexAttributePanel/VertexAttributePanel";

import "./Panel.less";

type Props = { data: Node.Data<GPUBase> };
const Panel: FC<Props> = ({ data }) => {
  switch (data.type) {
    case "Buffer": {
      return (
        <BufferPanel data={data as BufferData}>
          <></>
        </BufferPanel>
      );
    }
    case "CanvasPanel": {
      return (
        <CanvasPanel data={data as CanvasPanelData}>
          <></>
        </CanvasPanel>
      );
    }
    case "CommandEncoder": {
      return (
        <CommandEncoderPanel data={data as CommandEncoderData}>
          <></>
        </CommandEncoderPanel>
      );
    }
    case "Data": {
      return (
        <DataPanel data={data as DataData}>
          <></>
        </DataPanel>
      );
    }
    case "DrawCall": {
      return (
        <DrawCallPanel data={data as DrawCallData}>
          <></>
        </DrawCallPanel>
      );
    }
    case "FragmentState": {
      return (
        <FragmentStatePanel data={data as FragmentStateData}>
          <></>
        </FragmentStatePanel>
      );
    }
    case "RenderPass": {
      return (
        <RenderPassPanel data={data as RenderPassData}>
          <></>
        </RenderPassPanel>
      );
    }
    case "RenderPipeline": {
      return (
        <RenderPipelinePanel data={data as RenderPipelineData}>
          <></>
        </RenderPipelinePanel>
      );
    }
    case "ShaderModule": {
      return (
        <ShaderModulePanel data={data as ShaderModuleData}>
          <></>
        </ShaderModulePanel>
      );
    }
    case "VertexState": {
      return (
        <VertexStatePanel data={data as VertexStateData}>
          <></>
        </VertexStatePanel>
      );
    }
    case "VertexBufferLayout": {
      return (
        <VertexBufferLayoutPanel data={data as VertexBufferLayoutData}>
          <></>
        </VertexBufferLayoutPanel>
      );
    }
    case "VertexAttribute": {
      return (
        <VertexAttributePanel data={data as VertexAttributeData}>
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
