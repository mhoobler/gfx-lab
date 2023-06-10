import { NodeContext } from "components";
import Receiver from "components/Receiver/Receiver";
import { Color, Node, BufferUsageTable } from "data";
import { FC, useContext, useState } from "react";

import "./BufferPanel.less";

export type BufferData = Node.Data<GPUBufferDescriptor, Node.Receivers<"Data">>;
const type = "Buffer";
const BufferInit: Node.InitFn<BufferData> = (uuid, xyz) => ({
  type,
  uuid,
  headerColor: new Color(220, 0, 220),
  size: [400, 200],
  xyz,
  body: {
    label: type,
    size: 8,
    usage: 0,
    buffer: null,
    data: null,
  },
  sender: {
    uuid,
    type,
    value: null,
    to: new Set(),
  },
  receivers: {
    Data: [
      {
        uuid,
        type: "Data",
        from: null,
      },
    ],
  },
});

const BufferJson = (body: GPUBufferDescriptor & GPUBase) => {
  const { label, usage } = body;
  return { label, usage };
};

type Props = PanelProps<BufferData>;
const BufferPanel: FC<Props> = ({ data }) => {
  const { dispatch } = useContext(NodeContext);
  const { uuid, body } = data;
  const [usage, setUsage] = useState(body.usage);
  const dataReceiver = data.receivers["Data"][0];

  const handleUsage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = evt.target.checked ? 1 : -1;
    const usage = parseInt(evt.target.value);

    if (!isNaN(usage)) {
      body.usage += usage * isChecked;
      dispatch({ type: "EDIT_NODE_BODY", payload: { uuid, body } });
    }
    setUsage(body.usage);
  };

  return (
    <div className="input-container buffer col">
      <ul className="usage-list row">
        {BufferUsageTable.map(([key, value]) => {
          let isChecked = (usage & value) === value;

          return (
            <li className="usage-item row" key={data.uuid + key}>
              <input
                type="checkbox"
                value={value}
                checked={isChecked}
                onChange={handleUsage}
              />
              <label>{key}</label>
            </li>
          );
        })}
      </ul>
      <Receiver receiver={dataReceiver} index={0}>
        {dataReceiver.type}
      </Receiver>
    </div>
  );
};

export { BufferPanel, BufferInit, BufferJson };
