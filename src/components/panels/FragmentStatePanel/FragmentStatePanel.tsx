import { Color, Node } from "data";
import { FC } from "react";
import { Receiver } from "components";

export type FragmentStateData = Node.Data<GPUFragmentState, Node.Receivers<"ShaderModule">>;
const type = "FragmentState";
const FragmentStateInit: Node.InitFn<FragmentStateData> = (
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

type Props = PanelProps2<FragmentStateData>;
const FragmentStatePanel: FC<Props> = ({ data }) => {
  const shaderModuleReceiver = data.receivers["ShaderModule"][0];
  return (
    <div className="input-container">
      <Receiver receiver={shaderModuleReceiver} index={0}>
        {shaderModuleReceiver.type}
      </Receiver>
    </div>
  );
};

export { FragmentStatePanel, FragmentStateInit, FragmentStateJson };
