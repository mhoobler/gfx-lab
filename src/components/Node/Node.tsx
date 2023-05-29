import { FC, RefObject, createRef, useContext, useRef } from "react";

import "./style.less";
import { NodeContext, Panel } from "components";
import Sender from "./Sender";
import Receiver from "./Receiver";
import { viewBoxCoords } from "data";

type Props = {
  data: NodeData<GPUBase>;
  svgRef: RefObject<SVGElement>;
  view: any;
};

const Node: FC<Props> = ({ data, svgRef, view }) => {
  const { dispatch } = useContext(NodeContext);
  const gRef = useRef<SVGGElement>(null);
  const senderRef = useRef<SVGCircleElement>(null);
  const receiverRefs = useRef<Map<string, RefObject<SVGCircleElement>>>(
    new Map()
  );

  const handleMouseDown = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (!svgRef.current || !gRef.current || !senderRef.current) {
      throw new Error("Ref error");
    }

    const bb = (evt.currentTarget as HTMLElement).getBoundingClientRect();
    let [bzx, bzy] = viewBoxCoords(bb.x, bb.y, view);
    let [zx, zy] = viewBoxCoords(evt.clientX, evt.clientY, view);
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
        let [vx, vy] = viewBoxCoords(evt2.clientX, evt2.clientY, view);
        const moveX = dx + vx;
        const moveY = dy + vy;

        gRef.current.setAttribute("transform", `translate(${moveX}, ${moveY})`);
        for (const sender of senderLines) {
          const cx = parseInt(senderRef.current.getAttribute("cx"));
          const cy = parseInt(senderRef.current.getAttribute("cy"));
          const r = parseInt(senderRef.current.getAttribute("r"));

          sender.setAttribute("x1", (moveX + cx + r).toString());
          sender.setAttribute("y1", (moveY + cy).toString());
        }
        for (const receiver of receiverLines) {
          const attr = (receiver as HTMLElement).dataset["receiverType"];
          const receiverRef = receiverRefs.current.get(attr);
          const cx = parseInt(receiverRef.current.getAttribute("cx"));
          const cy = parseInt(receiverRef.current.getAttribute("cy"));

          receiver.setAttribute("x2", (moveX + cx).toString());
          receiver.setAttribute("y2", (moveY + cy).toString());
        }
      });
    };

    const handleMouseUp = (evt2: MouseEvent) => {
      let [vx, vy] = viewBoxCoords(evt2.clientX, evt2.clientY, view);
      const x = dx + vx;
      const y = dy + vy;
      dispatch({ type: "MOVE_NODE", payload: { x, y, data } });

      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
  };

  const backgroundColor = data.headerColor.rgbaString();

  return (
    <g ref={gRef} transform={`translate(${data.xyz[0]}, ${data.xyz[1]})`}>
      <foreignObject width={data.size[0]} height={data.size[1]}>
        <div className="node-card">
          <div
            className="node-header"
            onMouseDown={handleMouseDown}
            style={{ backgroundColor }}
          >
            {data.body.label}
          </div>
          <div className="node-body">
            <Panel data={data} />
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
      {data.receivers &&
        data.receivers.map((receiver: NodeReceiver, index: number) => {
          const f = createRef<SVGCircleElement>();
          receiverRefs.current.set(receiver.type, f);
          return (
            <Receiver
              svgRef={svgRef}
              key={receiver.uuid + receiver.type + index}
              receiver={receiver}
              receiverRef={f}
              index={index}
            />
          );
        })}
    </g>
  );
};

export default Node;
