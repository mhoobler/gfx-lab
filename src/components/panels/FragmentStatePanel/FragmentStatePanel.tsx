import { Color } from "data";
import { FC } from "react";

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

type Props = PanelProps<GPUFragmentState>;
const FragmentStatePanel: FC<Props> = ({ children }) => {
  return <div className="input-container">{children}</div>;
};

export { FragmentStatePanel, FragmentStateInit };
