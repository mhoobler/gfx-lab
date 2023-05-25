import { NodeContext } from "../../components";
import { NodeConnection } from "../../data";
import React, { FC, useContext } from "react";

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
    const receiverType = receiver.type;

    dispatch({type: "DELETE_CONNECTION", payload: { receiverId, receiverType }});
  }

  return (
    <line
      className={`sender-${sender.uuid} receiver-${receiver.uuid}`}
      onClick={handleClick}
      x1={sendX}
      y1={sendY}
      x2={receiveX}
      y2={receiveY}
      data-receiver-type={receiver.type}
      stroke="black"
      strokeWidth="3px"
    />
  );
};

export default Connection;
