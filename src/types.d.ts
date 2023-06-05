type DefaultProps = { children: React.ReactNode };
type n = number;

type GPUBase =
  | GPUObjectBase
  | GPUObjectDescriptorBase
  | GPUPipelineDescriptorBase;

type WgpuContextState = {
  device?: GPUDevice;
  format?: GPUTextureFormat;
  adapter?: GPUAdapter;
  error?: Error;
};

interface GPUCanvasPanel {
  label: string;
  canvas: HTMLCanvasElement;
  ctx: GPUCanvasContext;
  createView: () => GPUTextureView;
}

interface GPUVertexAttributeEXT extends GPUVertexAttribute {
  label?: string;
}

interface GPUVertexBufferLayoutEXT extends GPUVertexBufferLayout {
  label?: string;
}

interface GPURenderPassDescriptorEXT extends GPURenderPassDescriptor {
  canvasPointer: GPUCanvasPanel;
}

interface GPUCommandEncoderDescriptorEXT extends GPUObjectDescriptorBase {
  renderPassDesc: GPURenderPassDescriptorEXT;
  drawCall: GPUDrawCall[];
}

interface GPUDrawCall extends GPUObjectBase {
  commandEncoderDesc: GPUCommandEncoderDescriptorEXT;
  buffer: GPUBuffer;
  renderPipeline?: GPURenderPipeline;
  vertexCount: number;
  instanceCount?: number;
  firstVertex?: number;
  firstInstance?: number;
}

interface GPUData extends GPUObjectBase {
  text: string;
  data?: Float32Array | Float64Array | Uint32Array | Uint16Array;
}

type PanelProps<T> = {
  body: T;
  uuid: string;
  children: React.ReactNode;
};

type PanelProps2<T> = {
  data: NodeData<T, NodeType>;
  uuid: string;
  children: React.ReactNode;
};

interface IColor {
  xyzw: [n, n, n, n];
  hexString: () => string;
  rgbaString: () => string;
}

type NodeType =
  | "Data"
  | "Buffer"
  | "ShaderModule"
  | "VertexState"
  | "VertexAttribute"
  | "VertexBufferLayout"
  | "FragmentState"
  | "CanvasPanel"
  | "RenderPipeline"
  | "RenderPass"
  | "CommandEncoder"
  | "DrawCall";

type NodeSender = {
  uuid: string;
  type: NodeType;
  value: GPUBase;
  to: Set<NodeData<GPUBase, NodeType>>;
};

type NodeReceiver = {
  uuid: string;
  type: NodeType;
  from: NodeData<GPUBase, NodeType> | null;
};

type NodeReceivers<K extends NodeType> = {
  [key in K]: {
    uuid: string;
    type: K;
    from: NodeData<GPUBase, NodeType> | null;
  }[];
};

type NodeConnection = {
  sender: {
    uuid: string;
    xyz: [n, n, n];
  };
  receiver: {
    type: string;
    uuid: string;
    xyz: [n, n, n];
  };
};
type ConnectionMap = Map<
  NodeData<GPUBase, NodeType>,
  Map<NodeData<GPUBase, NodeType>, number>
>;

type NodeJson = {
  uuid: string;
  type: NodeType;
  xyz: [n, n, n];
  size?: [n, n];
  body?: object;
  connections?: ConnectionJson[];
};

type ConnectionJson = { uuid: string; receiverIndex: number };

interface NodeBase {
  uuid: string;
  type: NodeType;
  headerColor: IColor;
  xyz: [n, n, n];
  size: [n, n];
}

//interface NodeData<T> extends NodeBase {
//  body: T;
//  sender: NodeSender;
//  receivers: NodeReceiver[];
//}

interface NodeData<T, K extends NodeType> extends NodeBase {
  body: T;
  sender: NodeSender;
  receivers: NodeReceivers<K>;
}

type NodeInitFn<T, K extends NodeType> = (
  uuid: string,
  xyz: [n, n, n]
) => NodeData<T, K>;
