import { NodeContext } from "components";
import { Color } from "data";
import { FC, useContext } from "react";

const type = "Data";
const DataInit: NodeInitFn<GPUData> = (uuid, xyz) => ({
  type,
  uuid,
  headerColor: new Color(220, 0, 220),
  size: [200, 200],
  xyz,
  body: {
    label: type,
    text: "",
    data: null,
  },
  sender: {
    uuid,
    type,
    value: null,
    to: new Set(),
  },
  receivers: null,
});

type Props = PanelProps<GPUData>;
const DataPanel: FC<Props> = ({ uuid, body }) => {
  const { dispatch } = useContext(NodeContext);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    let text = evt.target.value;

    let newBody = {
      ...body,
      text,
      data: new Float32Array(
        text
          .split(",")
          .map((n) => parseFloat(n))
          .filter((e) => !isNaN(e))
      ),
    };

    dispatch({ type: "EDIT_NODE_BODY", payload: { uuid, body: newBody } });
  };

  return (
    <div className="input-container">
      <textarea value={body.text} onChange={handleChange} spellCheck="false" />
    </div>
  );
};

export { DataPanel, DataInit };
