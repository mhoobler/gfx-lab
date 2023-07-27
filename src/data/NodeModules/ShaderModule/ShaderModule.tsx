import { Node } from "data";
import { memo } from "react";

type GPUType = GPUShaderModuleDescriptor;

const receivers: Node.Receiver<GPUType>[] = [];

const component = memo(
  ({ instance, context }: Node.Props<GPUType>) => {
    const { body } = instance;

    const handleTextInput = context.handleTextInput(instance);

    return (
      <div className="node-body vertex-state">
        <div className="row center-v">
          <label>Label:&nbsp;</label>
          <input
            type="text"
            name="code"
            value={body.code}
            onChange={handleTextInput}
          />
        </div>
        <div className="column center-v">
          <label>WGSL Code:&nbsp;</label>
          <input
            type="text"
            name="code"
            value={body.code}
            onChange={handleTextInput}
          />
        </div>
      </div>
    );
  },
  (old, curr) => old.instance.body === curr.instance.body
);

const DEFAULT = {
  uuid: "UNASSIGNED",
  label: "ShaderModule",
  type: "ShaderModule",
  backgroundColor: "#AAF",
  position: [0, 0],
  size: [200, 200],
  body: {
    label: "ShaderModule",
    code: "",
  },
  resizable: true,
};

const ShaderModule: Node.Module<GPUType> = {
  sender: (state, node) => state.device.getShaderModule(node.body),
  component,
  default: DEFAULT,
  json: (node) => {
    const { label, code } = node.body;
    return { label, code };
  },
  receivers,
};

export { ShaderModule };

