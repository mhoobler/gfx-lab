import { FC, RefObject, useContext, useRef } from "react";

import { NodeContext, Panel } from "components";
import Sender from "./Sender";
import { viewBoxCoords } from "data";

import "./Node.less";

type Props = {
  data: NodeData<GPUBase, NodeType>;
  svgRef: RefObject<SVGElement>;
  view: { viewBox: n[] };
};

const Node: FC<Props> = ({ data, svgRef, view }) => {
  const { dispatch } = useContext(NodeContext);
  const gRef = useRef<SVGGElement>(null);
  const senderRef = useRef<SVGCircleElement>(null);

  const handleMove = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (!svgRef.current || !gRef.current || !senderRef.current) {
      throw new Error("Ref error");
    }

    const target = evt.currentTarget as HTMLElement;
    target.style.cursor = "grabbing";

    const bb = target.getBoundingClientRect();
    const [bzx, bzy] = viewBoxCoords(bb.x, bb.y, view);
    const [zx, zy] = viewBoxCoords(evt.clientX, evt.clientY, view);
    const dx = bzx - zx;
    const dy = bzy - zy;

    svgRef.current.removeChild(gRef.current);
    svgRef.current.appendChild(gRef.current);

    const senderLines = document.querySelectorAll(
      `line[data-sender-id="${data.uuid}"]`
    );
    const receiverLines = document.querySelectorAll(
      `line[data-receiver-id="${data.uuid}"]`
    );

    const handleMouseMove = (evt2: MouseEvent) => {
      window.requestAnimationFrame(() => {
        const [vx, vy] = viewBoxCoords(evt2.clientX, evt2.clientY, view);
        const moveX = Math.round((dx + vx) * 100) / 100;
        const moveY = Math.round((dy + vy) * 100) / 100;

        gRef.current.setAttribute("transform", `translate(${moveX}, ${moveY})`);
        for (const sender of senderLines) {
          let bb = senderRef.current.getBoundingClientRect();
          const [cx, cy] = viewBoxCoords(
            bb.x + bb.width / 2,
            bb.y + bb.height / 2,
            view
          );

          sender.setAttribute("x1", cx.toString());
          sender.setAttribute("y1", cy.toString());
        }
        for (const receiver of receiverLines) {
          const attrType = (receiver as HTMLElement).dataset["receiverType"];
          const attrIndex = (receiver as HTMLElement).dataset["receiverIndex"];
          const receiverElm = document.querySelector(
            `.receiver[data-uuid="${data.uuid}"][data-type="${attrType}"][data-index="${attrIndex}"]`
          );
          let bb = receiverElm.getBoundingClientRect();
          const [cx, cy] = viewBoxCoords(
            bb.x + bb.width / 2,
            bb.y + bb.height / 2,
            view
          );

          receiver.setAttribute("x2", cx.toString());
          receiver.setAttribute("y2", cy.toString());
        }
      });
    };

    const handleMouseUp = (evt2: MouseEvent) => {
      target.style.cursor = "grab";

      const [vx, vy] = viewBoxCoords(evt2.clientX, evt2.clientY, view);
      const x = dx + vx;
      const y = dy + vy;
      dispatch({ type: "MOVE_NODE", payload: { x, y, data } });

      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
  };

  const handleResize = () => {
    console.warn("TODO!");
  };

  const backgroundColor = data.headerColor.rgbaString();

  return (
    <g
      className={data.type}
      ref={gRef}
      transform={`translate(${data.xyz[0]}, ${data.xyz[1]})`}
    >
      <foreignObject width={data.size[0]} height={data.size[1]}>
        <div className="node-card col center-v">
          <div
            className="node-header center-v"
            onMouseDown={handleMove}
            style={{ backgroundColor }}
          >
            {data.body.label}
          </div>
          <div className="node-body">
            <Panel data={data} />
          </div>
          <div className="node-footer">
            <div className="resizer" onMouseDown={handleResize}></div>
          </div>
        </div>
      </foreignObject>
      <Sender
        svgRef={svgRef}
        sender={data.sender}
        senderRef={senderRef}
        width={data.size[0]}
        view={view}
      />
    </g>
  );
};

export default Node;
