/* eslint-disable */
export class Color {
  static Red = new Color(255, 0, 0);
  static Green = new Color(0, 255, 0);
  static Blue = new Color(0, 0, 255);
  static Pink = new Color(255, 200, 200);
  static Cyan = new Color(0, 255, 255);
  static Maroon = new Color(125, 0, 0);
  static Sage = new Color(0, 125, 0);

  xyzw: [n, n, n, n];

  constructor(r: n, g: n, b: n, a: n = 1) {
    this.xyzw = [r, g, b, a];
  }

  hexString() {
    const [r, g, b] = this.xyzw;
    return `${((r << 16) + (g << 8) + b).toString(16)}`;
  }
  rgbaString() {
    const [r, g, b, a] = this.xyzw;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
}

export interface INodeSender<K, T> {
  uuid: string;
  type: K;
  value: any;
  to: Set<NodeData<T>>;
}

export interface INodeReceiver<T> {
  uuid: string;
  type: NodeType;
  from: NodeData<T> | null;
}

export type NodeConnection = {
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

export const NodeTypes = [
  "ShaderModule",
  "VertexState",
  "FragmentState",
  "CanvasPanel",
  "RenderPipeline",
  "RenderPass",
  "CommandEncoder",
  "DrawCall",
] as const;

const NodeColors = {
  ShaderModule: new Color(255, 255, 0),
  VertexState: new Color(255, 0, 125),
  FragmentState: new Color(0, 255, 0),
  RenderPipeline: new Color(0, 0, 255),
  CanvasPanel: new Color(255, 255, 255),
  RenderPass: new Color(255, 200, 200),
  CommandEncoder: Color.Sage,
  DrawCall: Color.Maroon,
} as const;

const NodeSendTypes: {
  [T in NodeType]: (uuid: string) => INodeSender<T, any>;
} = {
  ShaderModule: (uuid: string) => ({
    uuid,
    type: "ShaderModule",
    value: null,
    to: new Set(),
  }),
  VertexState: (uuid: string) => ({
    uuid,
    type: "VertexState",
    value: null,
    to: new Set(),
  }),
  FragmentState: (uuid: string) => ({
    uuid,
    type: "FragmentState",
    value: null,
    to: new Set(),
  }),
  RenderPipeline: (uuid: string) => ({
    uuid,
    type: "RenderPipeline",
    value: null,
    to: new Set(),
  }),
  CanvasPanel: (uuid: string) => ({
    uuid,
    type: "CanvasPanel",
    value: null,
    to: new Set(),
  }),
  RenderPass: (uuid) => ({
    uuid,
    type: "RenderPass",
    value: null,
    to: new Set(),
  }),
  CommandEncoder: (uuid) => ({
    uuid,
    type: "CommandEncoder",
    value: null,
    to: new Set(),
  }),
  DrawCall: (uuid) => ({
    uuid,
    type: "DrawCall",
    value: null,
    to: new Set(),
  })
} as const;

const NodeReceiveTypes: {
  [T in NodeType]: (uuid: string) => INodeReceiver<any>[] | null;
} = {
  ShaderModule: () => null,
  CanvasPanel: () => null,
  CommandEncoder: (uuid: string) => [
    {
      uuid,
      type: "RenderPass",
      from: null,
    },
    {
      uuid,
      type: "DrawCall",
      from: null,
    },
  ],
  VertexState: (uuid: string) => [
    {
      uuid,
      type: "ShaderModule",
      from: null,
    },
  ],
  FragmentState: (uuid: string) => [
    {
      uuid,
      type: "ShaderModule",
      from: null,
    },
  ],
  RenderPipeline: (uuid: string) => [
    {
      uuid,
      type: "VertexState",
      from: null,
    },
    {
      uuid,
      type: "FragmentState",
      from: null,
    },
  ],
  RenderPass: (uuid: string) => [
    {
      uuid,
      type: "CanvasPanel",
      from: null,
    },
  ],
  DrawCall: (uuid: string) => [
    {
      uuid,
      type: "RenderPipeline",
      from: null,
    },
  ],
};

export type NodeType = (typeof NodeTypes)[number];
export type NodeColor = (typeof NodeColors)[NodeType];
export type NodeSender = ReturnType<(typeof NodeSendTypes)[NodeType]>;
export type NodeReceivers = ReturnType<(typeof NodeReceiveTypes)[NodeType]>;

export interface NodeData<T> {
  uuid: string;
  xyz: [n, n, n];
  size: [n, n];
  headerColor: NodeColor;
  type: NodeType;
  body: T;
  sender: NodeSender;
  receivers: NodeReceivers;
}

export interface NodeFactoryFunctions {
  // Needs better type handling
  // tsserver currently does not warn
  // when trying to call
  // NodeFactory.VertexState(.., body: GPURenderPipelineDescriptor)
  [key: string]: (uuid: string, xyz: [n, n, n], body: any) => NodeData<any>;
}

export class NODE_ATTRS {}

export class NODE_COLORS {
  static ShaderModule = new Color(255, 255, 0);
  static VertexState = new Color(255, 0, 125);
  static FragmentState = new Color(0, 255, 0);
  static RenderPipeline = new Color(0, 0, 255);
  static CanvasPanel = new Color(255, 255, 255);
}

export class NODE_SIZE {
  static ShaderModule: [n, n] = [400, 800];
  static VertexState: [n, n] = [200, 200];
  static FragmentState: [n, n] = [200, 200];
  static RenderPipeline: [n, n] = [200, 200];
  static CanvasPanel: [n, n] = [200, 200];
}

export type NodeDataProps<T> = {
  type: NodeType;
  uuid: string;
  size: [n, n];
  xyz: [n, n, n];
  body: T;
};
export function createNodeData<T>(args: NodeDataProps<T>): NodeData<T> {
  const { type, uuid } = args;
  return {
    ...args,
    headerColor: NodeColors[type],
    sender: NodeSendTypes[type](uuid),
    receivers: NodeReceiveTypes[type](uuid),
  };
}

export const NodeFactory: {
  [T in NodeType]: (uuid: string, xyz: [n, n, n]) => NodeData<any>;
} = {
  ShaderModule: (uuid, xyz): NodeData<GPUShaderModuleDescriptor> =>
    createNodeData({
      type: "ShaderModule",
      uuid,
      size: [400, 600],
      xyz,
      body: {
        label: "ShaderModule",
        code: "",
      },
    }),
  VertexState: (uuid, xyz): NodeData<GPUVertexState> =>
    createNodeData({
      type: "VertexState",
      uuid,
      size: [200, 200],
      xyz,
      body: {
        label: "VertexState",
        module: null,
        entryPoint: "vs",
      },
    }),
  FragmentState: (uuid, xyz): NodeData<GPUFragmentState> =>
    createNodeData({
      type: "FragmentState",
      uuid,
      size: [200, 200],
      xyz,
      body: {
        label: "FragmentState",
        module: null,
        entryPoint: "fs",
        targets: [],
      },
    }),
  RenderPipeline: (uuid, xyz): NodeData<GPURenderPipelineDescriptor> =>
    createNodeData({
      type: "RenderPipeline",
      uuid,
      size: [200, 200],
      xyz,
      body: {
        label: "RenderPipeline",
        layout: "auto",
        vertex: null,
        fragment: null,
        primitive: {
          topology: "triangle-strip",
        },
      },
    }),
  RenderPass: (uuid, xyz): NodeData<GPURenderPassDescriptorEXT> =>
    createNodeData({
      type: "RenderPass",
      uuid,
      size: [200, 200],
      xyz,
      body: {
        label: "RenderPass",
        colorAttachments: [
          {
            view: undefined,
            clearValue: [0.0, 0.0, 0.3, 1],
            loadOp: "clear",
            storeOp: "store",
          },
        ],
        createView: null,
        drawVertecies: 3,
      },
    }),
  CanvasPanel: (uuid, xyz): NodeData<GPUCanvasPanel> =>
    createNodeData({
      type: "CanvasPanel",
      uuid,
      size: [200, 200],
      xyz,
      body: {
        label: "CanvasPanel",
        canvas: null,
        ctx: null,
      },
    }),

  CommandEncoder: (uuid, xyz): NodeData<GPUCommandEncoderDescriptorEXT> =>
    createNodeData({
      type: "CommandEncoder",
      uuid,
      size: [200, 200],
      xyz,
      body: {
        label: "CommandEncoder",
        renderPassDesc: null,
      },
    }),
  DrawCall: (uuid, xyz): NodeData<GPUDrawCall> =>
    createNodeData({
      type: "DrawCall",
      uuid,
      size: [200, 200],
      xyz,
      body: {
        label: "DrawCall",
        commandEncoderDesc: null,
        vertexCount: 3,
      },
    }),
};
//FragmentState: () => {},
//RenderPipeline: () => {},
//CanvasPanel: () => {},
//RenderPass: () => {},
//CommandEncoder: () => {},
//FILL: (xyz: [n, n, n], body: GPUFILL) => {
//  let type: NodeType = "FILL";
//  let size: [n, n] = [200, 200];

//  return {
//    uuid,
//    xyz,
//    size,
//    type,
//    body,
//    ...factoryHelper(uuid, type)
//  };
//},

export type NodeContextState = {
  nodes: NodeData<unknown>[];
  connections: NodeConnection[];
};
