import {FC} from "react";

export { default as Panel } from "./Panel/Panel";

import { CanvasPanelInit } from "./CanvasPanel/CanvasPanel";
import { CommandEncoderInit } from "./CommandEncoderPanel/CommandEncoderPanel";
import { DrawCallInit } from "./DrawCallPanel/DrawCallPanel";
import { FragmentStateInit } from "./FragmentStatePanel/FragmentStatePanel";
import { RenderPassInit } from "./RenderPassPanel/RenderPassPanel";
import { RenderPipelineInit } from "./RenderPipelinePanel/RenderPipelinePanel";
import { ShaderModuleInit } from "./ShaderModulePanel/ShaderModulePanel";
import { VertexStateInit } from "./VertexStatePanel/VertexStatePanel";
export class NodeInitFn {
  static CommandEncoder = CommandEncoderInit;
  static CanvasPanel = CanvasPanelInit;
  static DrawCall = DrawCallInit;
  static FragmentState = FragmentStateInit;
  static RenderPass = RenderPassInit;
  static RenderPipeline = RenderPipelineInit;
  static ShaderModule = ShaderModuleInit;
  static VertexState = VertexStateInit;
}

