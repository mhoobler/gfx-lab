import React, {FC} from "react";

type Props = {
  body: GPUVertexState;
  handleBodyEdit: (body: GPUShaderModuleDescriptor, cb: () => void) => void;
};

const VertexStatePanel: FC<Props> = () => {
  return (
    <div>VertexStatePanel</div>
  );
}

export default VertexStatePanel;

