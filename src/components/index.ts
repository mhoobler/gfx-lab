export { NodeContext as NodeContext } from "./NodeContext/NodeContext";
export { NodeProvider as NodeProvider } from "./NodeContext/NodeContext";
export { default as NodeBoard } from "./NodeBoard/NodeBoard";
export { default as Node } from "./Node/Node";
export { default as Connection } from "./Connection/Connection";

export { CanvasPanel } from "./CanvasPanel/CanvasPanel";
export { CommandEncoderPanel } from "./CommandEncoderPanel/CommandEncoderPanel";
export { DrawCallPanel } from "./DrawCallPanel/DrawCallPanel";
export { FragmentStatePanel } from "./FragmentStatePanel/FragmentStatePanel";
export { RenderPassPanel } from "./RenderPassPanel/RenderPassPanel";
export { RenderPipelinePanel } from "./RenderPipelinePanel/RenderPipelinePanel";
export { ShaderModulePanel } from "./ShaderModulePanel/ShaderModulePanel";
export { VertexStatePanel } from "./VertexStatePanel/VertexStatePanel";

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
