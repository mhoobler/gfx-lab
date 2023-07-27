import {
  Receiver as ReceiverType,
  Props,
  Module,
  Instance,
} from "data/Node/Node";
import { VERTEX_FORMATS } from "data/Constants/Constants";
import { memo } from "react";

type GPUType = GPUVertexAttribute;

const receivers: ReceiverType<GPUType>[] = [];

const component = memo(
  ({ instance, context }: Props<GPUType>) => {
    const { body } = instance;

    const handleTextInput = context.handleTextInput(instance);
    const handleNumberInput = context.handleNumberInput(instance);

    return (
      <div className="node-body vertex-attribute">
        <div className="row center-v">
          <label>Fromat:&nbsp;</label>
          <select
            name="stepMode"
            onChange={handleTextInput}
            value={body.format}
          >
            {VERTEX_FORMATS.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
        <div className="row center-v">
          <label>Offset:&nbsp;</label>
          <input
            type="text"
            name="offset"
            value={body.offset}
            onChange={handleNumberInput}
          />
        </div>
        <div className="row center-v">
          <label>ShaderLocation:&nbsp;</label>
          <input
            type="text"
            name="shaderLocation"
            value={body.shaderLocation}
            onChange={handleNumberInput}
          />
        </div>
      </div>
    );
  },
  (old, curr) => old.instance.body === curr.instance.body
);

const DEFAULT: Instance<GPUType> = {
  uuid: "UNASSIGNED",
  label: "VertexAttribute",
  type: "VertexAttribute",
  position: [0, 0],
  size: [200, 200],
  body: {
    format: "float32",
    offset: 0,
    shaderLocation: 0,
  },
  resizable: false,
};

const VertexAttribute: Module<GPUType> = {
  sender: (_state, node) => node.body,
  component,
  default: DEFAULT,
  backgroundColor: "#AAF",
  json: (node) => {
    const { format, offset, shaderLocation } = node.body;
    return { format, offset, shaderLocation };
  },
  receivers,
};

export { VertexAttribute };
