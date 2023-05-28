import { FC, useContext, MouseEvent } from "react";

import { Color } from "../../data";
import { NodeContext } from "../../components";

const type = "CommandEncoder";
const CommandEncoderInit: NodeInitFn<GPUCommandEncoderDescriptorEXT> = (
  uuid,
  xyz
) => ({
  type,
  uuid,
  headerColor: Color.Sage,
  size: [200, 200],
  xyz,
  body: {
    label: type,
    renderPassDesc: null,
    drawCall: [],
  },
  sender: {
    uuid,
    type,
    value: null,
    to: new Set(),
  },
  receivers: [
    {
      uuid,
      type: "RenderPass",
      from: null,
    },
    {
      uuid,
      type: "DrawCall",
      from: null,
    },
  ],
});

type Props = PanelProps<GPUCommandEncoderDescriptorEXT>;
const CommandEncoderPanel: FC<Props> = ({ uuid }) => {
  const { dispatch } = useContext(NodeContext);

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    const receiver = { uuid, type: "DrawCall", from: null };
    dispatch({ type: "ADD_DRAW_CALL", payload: { uuid, receiver } });
  };

  return (
    <>
      <form>
        <button onClick={handleClick}>Add Draw Call</button>
      </form>
    </>
  );
};

export { CommandEncoderPanel, CommandEncoderInit };
