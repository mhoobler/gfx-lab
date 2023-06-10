import { FC, RefObject, useContext } from "react";
import { NodeContext } from "components";
import { viewBoxCoords, Node } from "data";

type Props = {
  svgRef: RefObject<SVGElement>;
  sender: Node.Sender;
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
      bb.x + bb.width,
      bb.y + bb.height / 2,
      view
    );

    // Create temporary line element
    const line = getLine(cx, cy);
    svgRef.current.prepend(line);

    let elm: HTMLElement | null;
    let backgroundColor: string | null;
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
        backgroundColor = backgroundColor || moveTarget.style.backgroundColor;
        elm.style.backgroundColor = "red";
      } else if (isReceiver && recieverType && correctType) {
        elm = moveTarget;
        backgroundColor = backgroundColor || moveTarget.style.backgroundColor;
        elm.style.backgroundColor = "lime";
      } else if (elm) {
        elm.style.backgroundColor = backgroundColor;
        elm = null;
        backgroundColor = null;
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
        // Remove temporary line element and render Connector component in React
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
    <path
      transform={`translate(${width}, 5) scale(.75)`}
      cx={width + 40}
      cy={5}
      r="10"
      d="M 0 14 L 0 25 C 0 28 0 28 2 26 L 10 17 C 12 14 12 14 10 11 L 2 2 C 0 0 0 0 0 3 Z"
      className="sender"
      data-uuid={sender.uuid}
      onMouseDown={handleMouseDown}
      ref={senderRef}
      fill="yellow"
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
  line.setAttribute("stroke-width", "4px");
  line.setAttribute("pointer-events", "none");
  return line;
}

export default Sender;
