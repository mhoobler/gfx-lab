import { NodeContext } from "../../components";
import React, { FC, useContext } from "react";

type Props = PanelProps<GPUCommandEncoderDescriptorEXT>;
const CommandEncoderPanel: FC<Props> = ({ uuid }) => {
  const { dispatch } = useContext(NodeContext);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const receiver = {uuid, type: "DrawCall", from: null};
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

export default CommandEncoderPanel;
