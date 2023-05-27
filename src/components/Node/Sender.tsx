import React, { FC, RefObject, useContext } from "react";
import { NodeSender } from "../../data";
import { centerCoords } from "../../dnd";
import { NodeContext } from "../../components";

type Props = {
  svgRef: RefObject<SVGElement>;
  sender: NodeSender;
  senderRef: RefObject<SVGCircleElement>;
  width: number;
};
const Sender: FC<Props> = ({ svgRef, sender, senderRef, width }) => {
  const { dispatch } = useContext(NodeContext);

  const handleMouseDown = (evt: React.MouseEvent<SVGCircleElement>) => {
    if (!svgRef.current) {
      throw new Error("Ref error");
    }

    const downTarget = evt.currentTarget as unknown as HTMLElement;
    const [cx, cy] = centerCoords(downTarget);

    const line = getLine(cx, cy);
    svgRef.current.appendChild(line);

    let elm: HTMLElement | null;
    let correctType = false;

      // eslint-disable-next-line
    const handleMouseMove: any = (evt2: MouseEvent) => {
      const moveTarget = evt2.target as HTMLElement;
      const x = evt2.clientX;
      const y = evt2.clientY;

      line.setAttribute("x2", x.toString());
      line.setAttribute("y2", y.toString());

      const isReceiver = moveTarget.classList.contains("receiver");
      const recieverType = moveTarget.dataset["receiverType"];
      correctType = recieverType === sender.type;

      if (isReceiver && recieverType && !correctType) {
        elm = moveTarget;
        elm.style.filter = "drop-shadow(0 0 5px red)";
      } else if (isReceiver && recieverType && correctType) {
        elm = moveTarget;
        elm.style.filter = "drop-shadow(0 0 5px green)";
      } else if (elm) {
        elm.style.filter = "";
        elm = null;
      }
    };

      // eslint-disable-next-line
    const handleMouseUp: any = () => {
      if (elm && correctType) {
        const receiverId = elm.dataset["uuid"];
        const receiverIndex = parseInt(elm.dataset["index"]);
        let payload = {sender, receiverId, receiverIndex};
        dispatch({ type: "LINK_SENDER_NODE", payload });

        svgRef.current.removeChild(line);
        elm.style.filter = "";
        // Remove line element and render some kind of Connector element in React
      } else {
        svgRef.current.removeChild(line);
        if (elm) {
          elm.style.filter = "";
        }
      }

      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
  };
  return (
    <circle
      onMouseDown={handleMouseDown}
      ref={senderRef}
      cx={`${width - 10}`}
      cy="30"
      r="8"
      fill="orange"
    />
  );
};

function getLine(x: number, y: number): SVGLineElement {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x.toString());
  line.setAttribute("y1", y.toString());
  line.setAttribute("x2", x.toString());
  line.setAttribute("y2", y.toString());
  line.setAttribute("stroke", "black");
  line.setAttribute("stroke-width", "3px");
  line.setAttribute("pointer-events", "none");
  return line;
}

export default Sender;
