import { Receiver } from "components/Receiver/Receiver";
import {
  Receiver as ReceiverType,
  Props,
  Module,
  Instance,
} from "data/Node/Node";
import { STEPMODES } from "data/Constants/Constants";
import { memo } from "react";

type GPUType = GPUVertexBufferLayout;

const receivers: ReceiverType<GPUType>[] = [
  [["VertexAttribute"], "attributes", "index"],
];

const component = memo(
  ({ instance, context }: Props<GPUType>) => {
    const { uuid, body } = instance;

    const attributes = body.attributes as GPUVertexAttribute[];

    const handleNumberInput = context.handleNumberInput(instance);
    const handleTextInput = context.handleTextInput(instance);
    const handleAddIndex = context.handleAddIndex(instance);
    const handleDeleteIndex = context.handleDeleteIndex(instance);

    return (
      <div className="node-body vertex-state">
        <div className="row center-v">
          <label>ArrayStride:&nbsp;</label>
          <input
            type="number"
            name="arrayStride"
            value={body.arrayStride}
            onChange={handleNumberInput}
          />
        </div>
        <div className="row center-v">
          <label>StepMode:&nbsp;</label>
          <select
            name="stepMode"
            onChange={handleTextInput}
            value={body.stepMode}
          >
            {STEPMODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
        {attributes.map((value, index) => (
          <Receiver
            key={`${uuid}.attributes.${index}`}
            uuid={uuid}
            property="attributes"
            index={index}
            objectKey={null}
            types={receivers[0][0]}
            value={value}
            handleDelete={handleDeleteIndex}
          >
            VertexAttribute
          </Receiver>
        ))}
        <div>
          <button name="attributes" onClick={handleAddIndex}>
            Add VertexAttribute
          </button>
        </div>
      </div>
    );
  },
  (old, curr) => old.instance.body === curr.instance.body
);

const DEFAULT: Instance<GPUType> = {
  uuid: "UNASSIGNED",
  label: "VertexBufferLayout",
  type: "VertexBufferLayout",
  position: [0, 0],
  size: [200, 200],
  body: {
    arrayStride: 0,
    stepMode: "vertex",
    attributes: [],
  },
  resizable: false,
};

const VertexBufferLayout: Module<GPUType> = {
  sender: (_state, node) => node.body,
  component,
  default: DEFAULT,
  json: (node) => {
    const { arrayStride, stepMode } = node.body;
    return { arrayStride, stepMode };
  },
  receivers,
};

export { VertexBufferLayout };
