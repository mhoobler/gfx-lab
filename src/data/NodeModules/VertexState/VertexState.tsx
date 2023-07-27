import { Receiver as ReceiverType, Props, Module, Instance } from "data/Node/Node";
import { Receiver } from "components/Receiver/Receiver";
import { memo } from "react";

type GPUType = GPUVertexState;

const receivers: ReceiverType<GPUType>[] = [
  [["ShaderModule"], "module", null],
  [["VertexBufferLayout"], "buffers", "index"],
];

const component = memo(
  ({ instance, context }: Props<GPUType>) => {
    const { uuid, body } = instance;

    const buffers = body.buffers as GPUVertexBufferLayout[];

    const handleTextInput = context.handleTextInput(instance);
    const handleAddIndex = context.handleAddIndex(instance);
    const handleDeleteIndex = context.handleDeleteIndex(instance);

    return (
      <div className="node-body vertex-state">
        <div className="row center-v">
          <label>EntryPoint:&nbsp;</label>
          <input
            type="text"
            name="entryPoint"
            value={body.entryPoint}
            onChange={handleTextInput}
          />
        </div>
        <Receiver
          uuid={uuid}
          property="module"
          index={null}
          objectKey={null}
          types={receivers[0][0]}
          value={body.module}
        >
          ShaderModule
        </Receiver>
        {buffers.map((value: GPUVertexBufferLayout, index: number) => (
          <Receiver
            key={`${uuid}.buffers.${index}`}
            uuid={uuid}
            property="buffers"
            index={index}
            objectKey={null}
            types={receivers[1][0]}
            value={value}
            handleDelete={handleDeleteIndex}
          >
            VertexBufferLayout
          </Receiver>
        ))}
        <div>
        <button name="buffers" onClick={handleAddIndex}>
          Add VertexBufferLayout
        </button>
        </div>
      </div>
    );
  },
  (old, curr) => old.instance.body === curr.instance.body
);

const DEFAULT: Instance<GPUType> = {
  uuid: "UNASSIGNED",
  label: "VertexState",
  type: "VertexState",
  position: [0, 0],
  size: [250, 200],
  body: {
    module: null,
    constants: null,
    entryPoint: "vertex",
    buffers: [null],
  },
  resizable: false,
};

const VertexState: Module<GPUType> = {
  sender: (_state, node) => node.body,
  component,
  backgroundColor: "#AAF",
  default: DEFAULT,
  json: (node) => {
    const { entryPoint } = node.body;
    return { entryPoint };
  },
  receivers,
};

export { VertexState };
