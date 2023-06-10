import { FC, RefObject, useContext, useRef, useState } from "react";

import { Sender, NodeContext, Panel } from "components";
import { viewBoxCoords, Node } from "data";

import "./NodeSVG.less";

type Props = {
  data: Node.Data<GPUBase>;
  svgRef: RefObject<SVGElement>;
  view: { viewBox: n[] };
};

const NodeSVG: FC<Props> = ({ data, svgRef, view }) => {
  const { dispatch } = useContext(NodeContext);
  const gRef = useRef<SVGGElement>(null);
  const senderRef = useRef<SVGCircleElement>(null);
  const [label, setLabel] = useState(data.body.label);

  const handleMouseDown = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (evt.button !== 0) {
      return;
    }
    if (!svgRef.current || !gRef.current || !senderRef.current) {
      console.warn("missing Ref");
      return;
    }

    const target = evt.currentTarget as HTMLElement;
    //document.body.style.cursor = "grabbing";

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
        const moveX = dx + vx;
        const moveY = dy + vy;

        gRef.current.setAttribute("transform", `translate(${moveX}, ${moveY})`);
        for (const sender of senderLines) {
          const bb = senderRef.current.getBoundingClientRect();
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
          const bb = receiverElm.getBoundingClientRect();
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

  const handleEditLabel = (evt: React.ChangeEvent<HTMLInputElement>) => {
    data.body.label = evt.target.value;
    setLabel(evt.target.value);
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
            className="node-header col center-h center-v"
            onMouseDown={handleMouseDown}
            style={{ backgroundColor }}
          >
            <div className="handle"></div>
            <input
              type="text"
              value={label}
              onChange={handleEditLabel}
              spellCheck="false"
            />
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

export default NodeSVG;
