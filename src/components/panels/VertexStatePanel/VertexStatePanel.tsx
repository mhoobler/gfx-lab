import { FC, useContext } from "react";

import "./VertexStatePanel.less";
import { Receiver2, NodeContext } from "components";
import { Color } from "data";

const type = "VertexState";
const VertexStateInit: NodeInitFn<
  GPUVertexState,
  "ShaderModule" | "VertexBufferLayout"
> = (uuid, xyz) => ({
  type,
  uuid,
  headerColor: new Color(255, 0, 125),
  size: [400, 200],
  xyz,
  body: {
    label: type,
    module: null,
    entryPoint: "vs",
    buffers: [],
  },
  sender: {
    uuid,
    type,
    value: null,
    to: new Set(),
  },
  receivers: {
    ShaderModule: [
      {
        uuid,
        type: "ShaderModule",
        from: null,
      },
    ],
    VertexBufferLayout: [
      {
        uuid,
        type: "VertexBufferLayout",
        from: null,
      },
    ],
  },
});

const VertexStateJson = (body: GPUVertexState & GPUBase) => {
  const { label, entryPoint } = body;
  return { label, entryPoint }
}

type Props = PanelProps2<GPUVertexState, "ShaderModule" | "VertexBufferLayout">;
const VertexStatePanel: FC<Props> = ({ data }) => {
  const { dispatch } = useContext(NodeContext);

  const handleAddLayout = (evt: React.MouseEvent) => {
    const index = data.receivers["VertexBufferLayout"].length;
    const receiver = {
      uuid: data.uuid,
      type: "VertexBufferLayout",
      from: null,
    };
    dispatch({
      type: "ADD_RECEIVER",
      payload: {
        index,
        receiver,
      },
    });
    evt.preventDefault();
  };

  const shaderModuleReceiver = data.receivers["ShaderModule"][0];
  const bufferLayoutReceivers = data.receivers["VertexBufferLayout"];

  return (
    <div className="input-container vertex-state-panel">
      <Receiver2 receiver={shaderModuleReceiver} index={0}>
        {shaderModuleReceiver.type}
      </Receiver2>
      {bufferLayoutReceivers.map((receiver, index) => (
        <Receiver2 key={data.uuid + index} receiver={receiver} index={index}>
          {receiver.type}
        </Receiver2>
      ))}
      <button onClick={handleAddLayout}>Add layout</button>
    </div>
  );
};

export { VertexStatePanel, VertexStateInit, VertexStateJson };
