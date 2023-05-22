import React, {FC} from "react";

type Props = {
  body: GPUFragmentState;
  handleBodyEdit: (body: GPUShaderModuleDescriptor, cb: () => void) => void;
};

const FragmentStatePanel: FC<Props> = () => {
  return (
    <div>FragmentStatePanel</div>
  );
}

export default FragmentStatePanel;
