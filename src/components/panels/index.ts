export { default as Panel } from "./Panel/Panel";

export { VertexStateUtils } from "./VertexStatePanel/VertexStatePanel";

import { CanvasPanelInit } from "./CanvasPanel/CanvasPanel";
import { CommandEncoderInit } from "./CommandEncoderPanel/CommandEncoderPanel";
import { DrawCallInit } from "./DrawCallPanel/DrawCallPanel";
import { FragmentStateInit } from "./FragmentStatePanel/FragmentStatePanel";
import { RenderPassInit } from "./RenderPassPanel/RenderPassPanel";
import { RenderPipelineInit } from "./RenderPipelinePanel/RenderPipelinePanel";
import { ShaderModuleInit } from "./ShaderModulePanel/ShaderModulePanel";
import { VertexStateInit } from "./VertexStatePanel/VertexStatePanel";
import { BufferInit } from "./BufferPanel/BufferPanel";
import { DataInit } from "./DataPanel/DataPanel";

export class NodeInitFn {
  static CommandEncoder = CommandEncoderInit;
  static CanvasPanel = CanvasPanelInit;
  static DrawCall = DrawCallInit;
  static FragmentState = FragmentStateInit;
  static RenderPass = RenderPassInit;
  static RenderPipeline = RenderPipelineInit;
  static ShaderModule = ShaderModuleInit;
  static VertexState = VertexStateInit;
  static Data = DataInit;
  static Buffer = BufferInit;
}
