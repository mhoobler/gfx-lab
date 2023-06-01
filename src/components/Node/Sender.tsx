import { FC, RefObject, useContext } from "react";
import { NodeContext } from "components";
import { viewBoxCoords } from "data";

type Props = {
  svgRef: RefObject<SVGElement>;
  sender: NodeSender;
  senderRef: RefObject<SVGCircleElement>;
  width: number;
  view: { viewBox: n[] };
};
const Sender: FC<Props> = ({ svgRef, sender, senderRef, width, view }) => {
  const { dispatch } = useContext(NodeContext);

  const handleMouseDown = (evt: React.MouseEvent<SVGCircleElement>) => {
    if (!svgRef.current) {
      throw new Error("Ref error");
    }

    const bb = (
      evt.currentTarget as unknown as HTMLElement
    ).getBoundingClientRect();
    const [cx, cy] = viewBoxCoords(
      bb.x + bb.width / 2,
      bb.y + bb.height / 2,
      view
    );

    const line = getLine(cx, cy);
    svgRef.current.appendChild(line);

    let elm: HTMLElement | null;
    let correctType = false;

    const handleMouseMove = (evt2: MouseEvent) => {
      const [vx, vy] = viewBoxCoords(evt2.clientX, evt2.clientY, view);

      line.setAttribute("x2", vx.toString());
      line.setAttribute("y2", vy.toString());

      const moveTarget = evt2.target as HTMLElement;
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

    const handleMouseUp = () => {
      if (elm && correctType) {
        const receiverId = elm.dataset["uuid"];
        const receiverIndex = parseInt(elm.dataset["index"]);
        const payload = { sender, receiverId, receiverIndex };
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
