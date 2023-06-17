import { NodeContext } from "components";
import { viewBoxCoords, Node } from "data";
import { FC, useContext, useEffect, useRef } from "react";

import "./Connection.less";

type Props = { conn: Node.Connection; view: { viewBox: n[] } };
const Connection2: FC<Props> = ({ conn, view }) => {
  const { dispatch } = useContext(NodeContext);
  const visibleRef = useRef(null);
  const invisibleRef = useRef(null);

  const { sender, receiver } = conn;

  useEffect(() => {
    if (!invisibleRef.current) {
      console.error("missing invisibleRef", conn);
      return;
    }
    if (!visibleRef.current) {
      console.error("missing visibleRef", conn);
      return;
    }

    const { sender, receiver } = conn;
    const senderElm = document.querySelector(
      `.sender[data-uuid="${sender.uuid}"]`
    );
    const receiverElm = document.querySelector(
      `.receiver[data-uuid="${receiver.uuid}"][data-type="${receiver.type}"][data-index="${receiver.index}"]`
    );
    const visElm = visibleRef.current;
    const invElm = invisibleRef.current;

    if (!senderElm) {
      console.error("missing senderElm", conn);
      return;
    }
    if (!receiverElm) {
      console.error("missing receiverElm", conn);
      return;
    }
    const sbb = senderElm.getBoundingClientRect();
    const rbb = receiverElm.getBoundingClientRect();

    const [x1, y1] = viewBoxCoords(
      sbb.x + sbb.width / 2,
      sbb.y + sbb.height / 2,
      view
    );
    const [x2, y2] = viewBoxCoords(
      rbb.x + rbb.width / 2,
      rbb.y + rbb.height / 2,
      view
    );

    visElm.setAttribute("x1", x1.toString());
    invElm.setAttribute("x1", x1.toString());
    visElm.setAttribute("y1", y1.toString());
    invElm.setAttribute("y1", y1.toString());
    visElm.setAttribute("x2", x2.toString());
    invElm.setAttribute("x2", x2.toString());
    visElm.setAttribute("y2", y2.toString());
    invElm.setAttribute("y2", y2.toString());

    visElm.dataset["senderId"] = sender.uuid;
    invElm.dataset["senderId"] = sender.uuid;
    visElm.dataset["receiverId"] = receiver.uuid;
    invElm.dataset["receiverId"] = receiver.uuid;
    visElm.dataset["receiverType"] = receiver.type;
    invElm.dataset["receiverType"] = receiver.type;
    visElm.dataset["receiverIndex"] = receiver.index;
    invElm.dataset["receiverIndex"] = receiver.index;
  }, [conn]);

  const handleDelete = () => {
    const receiverId = receiver.uuid;
    const senderId = sender.uuid;

    dispatch({ type: "DELETE_CONNECTION", payload: { receiverId, senderId } });
  };

  return (
    <>
      <line
        ref={invisibleRef}
        onClick={handleDelete}
        className="invisible"
        stroke="black"
        strokeOpacity="0%"
        strokeWidth="24px"
      ></line>
      <line
        ref={visibleRef}
        onClick={handleDelete}
        className="visible"
        stroke="black"
        strokeWidth="4px"
      ></line>
    </>
  );
};

export default Connection2;
