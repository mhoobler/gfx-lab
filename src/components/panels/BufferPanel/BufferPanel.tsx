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

type Props = PanelProps<GPUBufferDescriptor>;
const BufferPanel: FC<Props> = () => {
  return <div className="input-container">BufferPanel</div>;
};

export { BufferPanel, BufferInit };
