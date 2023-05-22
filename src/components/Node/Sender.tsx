import React, { FC, RefObject, useContext } from "react";
import { NodeSender } from "../../data";
import { centerCoords } from "../../dnd";
import { NodeContext } from "../../components/NodeContext";

type Props = { svgRef: RefObject<SVGElement>; sender: NodeSender };
const Sender: FC<Props> = ({ svgRef, sender }) => {
  const { dispatch } = useContext(NodeContext);

  const handleMouseDown = (evt: React.MouseEvent<SVGCircleElement>) => {
    if (!svgRef.current) {
      throw new Error("Ref error");
    }

    const downTarget = evt.currentTarget as unknown as HTMLElement;
    const [cx, cy] = centerCoords(downTarget);

    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", cx.toString());
    line.setAttribute("y1", cy.toString());
    line.setAttribute("x2", cx.toString());
    line.setAttribute("y2", cy.toString());
    line.setAttribute("stroke", "black");
    line.setAttribute("pointer-events", "none");
    svgRef.current.appendChild(line);

    let elm: HTMLElement | null;
    let correctType = false;
    const handleMouseMove: any = (evt2: MouseEvent) => {
      // eslint-disable-line
      let moveTarget = evt2.target as HTMLElement;
      const x = evt2.clientX;
      const y = evt2.clientY;

      line.setAttribute("x2", x.toString());
      line.setAttribute("y2", y.toString());

      let recieverType = moveTarget.dataset["recieverType"];
      correctType = recieverType === sender.type;

      if (recieverType && !correctType) {
        elm = moveTarget;
        elm.style.filter = "drop-shadow(0 0 5px red)";
      } else if (recieverType && correctType) {
        elm = moveTarget;
        elm.style.filter = "drop-shadow(0 0 5px green)";
      } else if (elm) {
        elm.style.filter = "";
        elm = null;
      }
    };

    const handleMouseUp: any = (evt2: MouseEvent) => {
      // eslint-disable-line
      if (elm && correctType) {
        dispatch({type: "LINK_NODE", payload: {} }) //TODO:
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
      cx="10"
      cy="10"
      r="10"
      fill="orange"
    />
  );
};

export default Sender;
