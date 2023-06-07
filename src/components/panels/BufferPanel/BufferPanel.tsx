import Receiver2 from "components/Receiver2/Receiver2";
import { Color } from "data";
import { FC } from "react";

const type = "Buffer";
const BufferInit: NodeInitFn<GPUBufferDescriptor, "Data"> = (uuid, xyz) => ({
  type,
  uuid,
  headerColor: new Color(220, 0, 220),
  size: [200, 200],
  xyz,
  body: {
    label: type,
    size: 8,
    usage: 0,
    buffer: null,
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

type Props = PanelProps2<GPUBufferDescriptor, "Data">;
const BufferPanel: FC<Props> = ({ data }) => {
  const dataReceiver = data.receivers["Data"][0];
  return (
    <div className="input-container">
      <Receiver2 receiver={dataReceiver} index={0}>
        {dataReceiver.type}
      </Receiver2>
    </div>
  );
};

export { BufferPanel, BufferInit };
