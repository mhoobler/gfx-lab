import { ChangeEvent, FC, useState } from "react";
import { Color } from "../../data";

import "./style.less";

const type = "ShaderModule";
const ShaderModuleInit: NodeInitFn<GPUShaderModuleDescriptor> = (
  uuid,
  xyz
) => ({
  type,
  headerColor: new Color(255, 255, 0),
  uuid,
  size: [400, 600],
  xyz,
  body: {
    label: type,
    code: "",
  },
  sender: {
    uuid,
    type,
    value: null,
    to: new Set(),
  },
  receivers: null,
});

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

export { ShaderModulePanel, ShaderModuleInit };
