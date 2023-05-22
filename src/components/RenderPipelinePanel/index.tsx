import React, { FC } from "react";

type Props = {
  body: GPURenderPipelineDescriptor;
  handleBodyEdit: (body: GPURenderPipelineDescriptor, cb: () => void) => void;
};
const RenderPipelinePanel: FC<Props> = () => {
  return (
    <>
      <div>RenderPipelinePanel</div>
    </>
  );
};
export default RenderPipelinePanel;
