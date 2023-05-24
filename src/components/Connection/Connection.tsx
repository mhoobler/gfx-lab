import { NodeContext } from "../../components";
import { NodeConnection } from "../../data";
import React, { FC, useContext } from "react";

type Props = { conn: NodeConnection };

const Connection: FC<Props> = ({ conn }) => {
  const { dispatch } = useContext(NodeContext);
  const { sender, receiver } = conn;
  let sendX = sender.xyz[0];
  let sendY = sender.xyz[1];
  let receiveX = receiver.xyz[0];
  let receiveY = receiver.xyz[1];

  const handleClick = () => {
    const receiverId = receiver.uuid;
    const receiverType = receiver.type;
    console.log(receiver);

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
