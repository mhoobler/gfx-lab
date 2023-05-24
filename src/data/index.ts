export class Color {
  xyzw: [n, n, n, n];

  constructor(r: n, g: n, b: n, a: n = 1) {
    this.xyzw = [r, g, b, a];
  }

  get r() {
    return this.xyzw[0];
  }
  set r(n: n) {
    this.xyzw[0] = n;
  }

  get b() {
    return this.xyzw[2];
  }
  set b(n: n) {
    this.xyzw[2] = n;
  }

  get g() {
    return this.xyzw[1];
  }
  set g(n: n) {
    this.xyzw[1] = n;
  }

  get a() {
    return this.xyzw[3];
  }
  set a(n: n) {
    this.xyzw[3] = n;
  }

  hexValue() {
    return `#${((this.r << 16) + (this.g << 8) + this.b).toString(16)}`;
  }
  rgbaValue() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}

export interface INodeSender<T> {
  uuid: string;
  type: GPUType;
  value: any;
  to: Set<NodeData<T>>;
}

export interface INodeReceiver<T> {
  uuid: string;
  type: GPUType;
  from: NodeData<T> | null;
}

export type NodeConnection = {
  sender: {
    uuid: string,
    xyz: [n, n, n],
  };
  receiver: {
    type: string,
    uuid: string,
    xyz: [n, n, n]
  };
};

const NodeTypes = [
  "ShaderModule",
  "VertexState",
  "FragmentState",
  "CanvasPanel",
  "RenderPipeline",
] as const;
const GPUTypes = [
  "GPUShaderModule",
  "GPUVertexState",
  "GPUFragmentState",
  "GPURenderPipeline",
  "GPUCanvasContext",
] as const;

const NodeColors = {
  ShaderModule: new Color(255, 255, 0),
  VertexState: new Color(255, 0, 125),
  FragmentState: new Color(0, 255, 0),
  RenderPipeline: new Color(0, 0, 255),
  CanvasPanel: new Color(255, 255, 255),
} as const;

const NodeSendTypes: { [T in NodeType]: (uuid: string) => INodeSender<any> } = {
  ShaderModule: (uuid: string) => ({
    uuid,
    type: "GPUShaderModule",
    value: null as GPUShaderModule,
    to: new Set(),
  }),
  VertexState: (uuid: string) => ({
    uuid,
    type: "GPUVertexState",
    value: null as GPUShaderModule,
    to: new Set(),
  }),
  FragmentState: (uuid: string) => ({
    uuid,
    type: "GPUFragmentState",
    value: null as GPUShaderModule,
    to: new Set(),
  }),
  RenderPipeline: (uuid: string) => ({
    uuid,
    type: "GPURenderPipeline",
    value: null as GPUShaderModule,
    to: new Set(),
  }),
  CanvasPanel: (uuid: string) => ({
    uuid,
    type: "GPUCanvasContext",
    value: null as GPUShaderModule,
    to: new Set(),
  }),
} as const;

const NodeReceiveTypes: {
  [T in NodeType]: (uuid: string) => INodeReceiver<any>[] | null;
} = {
  ShaderModule: () => null,
  VertexState: (uuid: string) => [
    {
      uuid,
      type: "GPUShaderModule",
      from: null,
    },
  ],
  FragmentState: (uuid: string) => [
    {
      uuid,
      type: "GPUShaderModule",
      from: null,
    },
  ],
  RenderPipeline: (uuid: string) => [
    {
      uuid,
      type: "GPUVertexState",
      from: null,
    },
    {
      uuid,
      type: "GPUFragmentState",
      from: null,
    },
  ],
  CanvasPanel: (uuid: string) => [
    {
      uuid,
      type: "GPURenderPipeline",
      from: null,
    },
  ],
};

export type NodeType = typeof NodeTypes[number];
export type GPUType = typeof GPUTypes[number];
export type NodeColor = typeof NodeColors[NodeType];
export type NodeSender = ReturnType<typeof NodeSendTypes[NodeType]>;
export type NodeReceivers = ReturnType<typeof NodeReceiveTypes[NodeType]>;

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

const factoryHelper = (
  uuid: string,
  type: NodeType
): {
  headerColor: NodeColor;
  sender: NodeSender;
  receivers: NodeReceivers;
} => ({
  headerColor: NodeColors[type],
  sender: NodeSendTypes[type](uuid),
  receivers: NodeReceiveTypes[type](uuid),
});

export const NodeFactory: NodeFactoryFunctions = {
  ShaderModule: (
    uuid: string,
    xyz: [n, n, n],
    body: GPUShaderModuleDescriptor
  ) => {
    let type: NodeType = "ShaderModule";
    let size: [n, n] = [400, 800];

    return {
      uuid,
      xyz,
      size,
      type,
      body,
      ...factoryHelper(uuid, type),
    };
  },
  VertexState: (uuid: string, xyz: [n, n, n], body: GPUVertexState) => {
    let type: NodeType = "VertexState";
    let size: [n, n] = [200, 200];

    return {
      uuid,
      xyz,
      size,
      type,
      body,
      ...factoryHelper(uuid, type),
    };
  },
  FragmentState: (uuid: string, xyz: [n, n, n], body: GPUFragmentState) => {
    let type: NodeType = "FragmentState";
    let size: [n, n] = [200, 200];

    return {
      uuid,
      xyz,
      size,
      type,
      body,
      ...factoryHelper(uuid, type),
    };
  },
  RenderPipeline: (uuid: string, xyz: [n, n, n], body: GPURenderPipeline) => {
    let type: NodeType = "RenderPipeline";
    let size: [n, n] = [200, 200];

    return {
      uuid,
      xyz,
      size,
      type,
      body,
      ...factoryHelper(uuid, type),
    };
  },
  CanvasPanel: (uuid: string, xyz: [n, n, n], body: GPUCanvasPanel) => {
    let type: NodeType = "CanvasPanel";
    let size: [n, n] = [200, 200];

    return {
      uuid,
      xyz,
      size,
      type,
      body,
      ...factoryHelper(uuid, type),
    };
  },
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
};

export type NodeContextState = {
  nodes: NodeData<unknown>[];
  connections: NodeConnection[];
};
