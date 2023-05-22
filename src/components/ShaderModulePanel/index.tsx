import React, { ChangeEvent, FC, useState } from "react";

import "./style.less";

type Props = {
  body: GPUShaderModuleDescriptor;
  handleBodyEdit: (body: GPUShaderModuleDescriptor, cb: () => void) => void;
};

const ShaderModulePanel: FC<Props> = ({ body }) => {
  const [code, setCode] = useState<string>(body.code);

  const handleChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = evt.currentTarget;
    body.code = value;
    setCode(body.code);
  };

  return (
    <>
      <form className="shader-module-descriptor">
        <br />
        <textarea value={code} onChange={handleChange} spellCheck="false" />
      </form>
    </>
  );
};

export default ShaderModulePanel;
