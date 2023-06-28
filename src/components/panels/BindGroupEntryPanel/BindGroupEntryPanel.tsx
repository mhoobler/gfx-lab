import { FC, useContext } from "react";
import { Color, Node } from "data";
import { NodeContext, Receiver, SelectionModal } from "components";

export type BindGroupEntryData = Node.Data<
  GPUBindGroupEntry,
  Node.Receivers<"Buffer">
>;
const type = "BindGroupEntry";
const BindGroupEntryInit: Node.InitFn<BindGroupEntryData> = (uuid, xyz) => ({
  type,
  uuid,
  headerColor: new Color(0, 175, 200),
  size: [200, 200],
  xyz,
  body: {
    label: type,
    binding: null,
    resource: null,
    // Not sure whre these two properties are coming from
    module: null,
    entryPoint: null,
  },
  sender: {
    uuid,
    type,
    value: null,
    to: new Set(),
  },
  receivers: {
    Buffer: [],
  },
});

const BindGroupEntryJson = (body: GPUBindGroupEntry & GPUBase) => {
  const { label, resource } = body;
  for (const key of Object.keys(resource)) {
    resource[key] = null;
  }
  return { label, resource };
};

type Props = PanelProps<BindGroupEntryData>;
const BindGroupEntryPanel: FC<Props> = ({ data }) => {
  const { dispatch } = useContext(NodeContext);

  const handleSelectResource = (type: Node.Type) => {
    if (type === "Sampler" || type === "Texture") {
      console.warn("TODO");
      return;
    }
    const receiver = {
      uuid: data.uuid,
      type,
      from: null,
    };
    dispatch({
      type: "EDIT_NODE",
      payload: {
        ...data,
        body: {
          ...data.body,
          resource: {
            [type.toLowerCase()]: null,
          },
        },
        receivers: {
          Buffer: [],
          [type]: [receiver],
        },
      },
    });
  };

  const bufferReceivers = data.receivers.Buffer;

  return (
    <div className="input-container bind-group-entry col">
      {bufferReceivers.map((receiver, index) => (
        <Receiver key={data.uuid + index} receiver={receiver} index={index}>
          {receiver.type}
        </Receiver>
      ))}

      {data.body.resource ? (
        <></>
      ) : (
        <SelectionModal
          items={["Buffer", "Sampler", "Texture"]}
          handleSelect={handleSelectResource}
        >
          Select Resource
        </SelectionModal>
      )}
    </div>
  );
};

export { BindGroupEntryInit, BindGroupEntryPanel, BindGroupEntryJson };
