import React, { ChangeEvent, FC, useState } from "react";

import "./style.less";

type Props = PanelProps<GPUShaderModuleDescriptor>;

const ShaderModulePanel: FC<Props> = ({ body, children }) => {
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
        {children}
      </form>
    </>
  );
};

export default ShaderModulePanel;
