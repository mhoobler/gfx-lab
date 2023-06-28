export { default as Panel } from "./Panel/Panel";

import { CanvasPanelInit, CanvasPanelJson } from "./CanvasPanel/CanvasPanel";
import {
  CommandEncoderInit,
  CommandEncoderJson,
} from "./CommandEncoderPanel/CommandEncoderPanel";
import { DrawCallInit, DrawCallJson } from "./DrawCallPanel/DrawCallPanel";
import {
  FragmentStateInit,
  FragmentStateJson,
} from "./FragmentStatePanel/FragmentStatePanel";
import {
  RenderPassInit,
  RenderPassJson,
} from "./RenderPassPanel/RenderPassPanel";
import {
  RenderPipelineInit,
  RenderPipelineJson,
} from "./RenderPipelinePanel/RenderPipelinePanel";
import {
  ShaderModuleInit,
  ShaderModuleJson,
} from "./ShaderModulePanel/ShaderModulePanel";
import {
  VertexStateInit,
  VertexStateJson,
} from "./VertexStatePanel/VertexStatePanel";
import { BufferInit, BufferJson } from "./BufferPanel/BufferPanel";
import { DataInit, DataJson } from "./DataPanel/DataPanel";
import {
  VertexBufferLayoutInit,
  VertexBufferLayoutJson,
} from "./VertexBufferLayoutPanel/VertexBufferLayoutPanel";
import {
  VertexAttributeInit,
  VertexAttributeJson,
} from "./VertexAttributePanel/VertexAttributePanel";
import { BindGroupInit, BindGroupJson } from "./BindGroupPanel/BindGroupPanel";
import {
  BindGroupEntryInit,
  BindGroupEntryJson,
} from "./BindGroupEntryPanel/BindGroupEntryPanel";

export class NodeInitFn {
  static Buffer = BufferInit;
  static CanvasPanel = CanvasPanelInit;
  static CommandEncoder = CommandEncoderInit;
  static Data = DataInit;
  static DrawCall = DrawCallInit;
  static FragmentState = FragmentStateInit;
  static RenderPass = RenderPassInit;
  static RenderPipeline = RenderPipelineInit;
  static ShaderModule = ShaderModuleInit;
  static VertexAttribute = VertexAttributeInit;
  static VertexBufferLayout = VertexBufferLayoutInit;
  static VertexState = VertexStateInit;
  static BindGroup = BindGroupInit;
  static BindGroupEntry = BindGroupEntryInit;
}

export class NodeBodyForJson {
  static Buffer = BufferJson;
  static CanvasPanel = CanvasPanelJson;
  static CommandEncoder = CommandEncoderJson;
  static Data = DataJson;
  static DrawCall = DrawCallJson;
  static FragmentState = FragmentStateJson;
  static RenderPass = RenderPassJson;
  static RenderPipeline = RenderPipelineJson;
  static ShaderModule = ShaderModuleJson;
  static VertexAttribute = VertexAttributeJson;
  static VertexBufferLayout = VertexBufferLayoutJson;
  static VertexState = VertexStateJson;
  static BindGroup = BindGroupJson;
  static BindGroupEntry = BindGroupEntryJson;
}
