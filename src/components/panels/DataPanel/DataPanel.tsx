import { NodeContext } from "components";
import { Color, Node } from "data";
import { FC, useContext, useState } from "react";

export type DataData = Node.Data<GPUData>;
const type = "Data";
const DataInit: Node.InitFn<DataData> = (uuid, xyz) => ({
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

const DataJson = (body: GPUData) => {
  const { label, text } = body;
  return { label, text };
};

type Props = PanelProps<DataData>;
const DataPanel: FC<Props> = ({ data }) => {
  const { dispatch } = useContext(NodeContext);
  const { body, uuid } = data;
  const [text, setText] = useState(body.text);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = evt.target.value;

    const newBody = {
      ...body,
      text,
      data: new Float32Array(
        text
          .split(",")
          .map((n) => parseFloat(n))
          .filter((e) => !isNaN(e))
      ),
    };

    setText(text);
    dispatch({ type: "EDIT_NODE_BODY", payload: { uuid, body: newBody } });
  };

  return (
    <div className="input-container data">
      <textarea value={text} onChange={handleChange} spellCheck="false" />
    </div>
  );
};

export { DataPanel, DataInit, DataJson };
