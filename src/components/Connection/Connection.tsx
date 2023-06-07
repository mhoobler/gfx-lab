import { NodeContext } from "../../components";
import { FC, useContext } from "react";

import "./Connection.less";

type Props = { conn: NodeConnection };

const Connection: FC<Props> = ({ conn }) => {
  const { dispatch } = useContext(NodeContext);
  const { sender, receiver } = conn;

  const sendX = sender.xyz[0];
  const sendY = sender.xyz[1];
  const receiveX = receiver.xyz[0];
  const receiveY = receiver.xyz[1];

  const handleClick = () => {
    const receiverId = receiver.uuid;
    const senderId = sender.uuid;

    dispatch({ type: "DELETE_CONNECTION", payload: { receiverId, senderId } });
  };

  return (
    <>
      <line
        className="invisible"
        onClick={handleClick}
        x1={sendX}
        y1={sendY}
        x2={receiveX}
        y2={receiveY}
        data-sender-id={sender.uuid}
        data-receiver-id={receiver.uuid}
        data-receiver-type={receiver.type}
        stroke="black"
        strokeOpacity="0%"
        strokeWidth="24px"
      />
      <line
        className="visible"
        x1={sendX}
        y1={sendY}
        x2={receiveX}
        y2={receiveY}
        data-sender-id={sender.uuid}
        data-receiver-id={receiver.uuid}
        data-receiver-type={receiver.type}
        stroke="black"
        strokeWidth="4px"
      />
    </>
  );
};

export default Connection;
