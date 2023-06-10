import Receiver from "components/Receiver/Receiver";
import { Color, Node } from "data";
import { FC } from "react";

export type BufferData = Node.Data<GPUBufferDescriptor, Node.Receivers<"Data">>;
const type = "Buffer";
const BufferInit: Node.InitFn<BufferData> = (
  uuid,
  xyz
) => ({
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

const BufferJson = (body: GPUBufferDescriptor & GPUBase) => {
  const { label, usage } = body;
  return { label, usage };
};

type Props = PanelProps2<BufferData>;
const BufferPanel: FC<Props> = ({ data }) => {
  const dataReceiver = data.receivers["Data"][0];
  return (
    <div className="input-container">
      <Receiver receiver={dataReceiver} index={0}>
        {dataReceiver.type}
      </Receiver>
    </div>
  );
};

export { BufferPanel, BufferInit, BufferJson };
