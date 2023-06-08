import { Color } from "data";
import { FC } from "react";
import { Receiver2 } from "components";

const type = "FragmentState";
const FragmentStateInit: NodeInitFn<GPUFragmentState, "ShaderModule"> = (
  uuid,
  xyz
) => ({
  type,
  headerColor: new Color(0, 255, 0),
  uuid,
  size: [200, 200],
  xyz,
  body: {
    label: "FragmentState",
    module: null,
    entryPoint: "fs",
    targets: [],
  },
  sender: {
    uuid,
    type,
    value: null,
    to: new Set(),
  },
  receivers: {
    ShaderModule: [
      {
        uuid,
        type: "ShaderModule",
        from: null,
      },
    ],
  },
});

const FragmentStateJson = (body: GPUFragmentState & GPUBase) => {
  const { label, entryPoint, targets } = body;
  return { label, entryPoint, targets }
}

type Props = PanelProps2<GPUFragmentState, "ShaderModule">;
const FragmentStatePanel: FC<Props> = ({ data }) => {
  const shaderModuleReceiver = data.receivers["ShaderModule"][0];
  return (
    <div className="input-container">
      <Receiver2 receiver={shaderModuleReceiver} index={0}>
        {shaderModuleReceiver.type}
      </Receiver2>
    </div>
  );
};

export { FragmentStatePanel, FragmentStateInit, FragmentStateJson };
