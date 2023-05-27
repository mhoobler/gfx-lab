import {
  NodeData,
  INodeReceiver,
} from "../../data";
import React, { FC, RefObject, createRef, useContext, useRef } from "react";

import "./style.less";
import {
  VertexStatePanel,
  ShaderModulePanel,
  FragmentStatePanel,
  RenderPipelinePanel,
  NodeContext,
  CanvasPanel,
  CommandEncoderPanel,
  RenderPassPanel,
  DrawCallPanel,
} from "../../components";
import Sender from "./Sender";
import Receiver from "./Receiver";
import { relativeCoords } from "../../dnd";

// eslint-disable-next-line
type Props = { data: NodeData<any>; svgRef: RefObject<SVGElement> };

const Node: FC<Props> = ({ data, svgRef }) => {
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

    const e = evt as unknown as MouseEvent;
    const [dx, dy] = relativeCoords(e);

    svgRef.current.removeChild(gRef.current);
    svgRef.current.appendChild(gRef.current);

    const senders = document.querySelectorAll(`[data-sender-id="${data.uuid}"]`);
    const receivers = document.querySelectorAll(`[data-receiver-id="${data.uuid}"]`);

    // eslint-disable-next-line
    const handleMouseMove: any = (evt2: MouseEvent) => {
      window.requestAnimationFrame(() => {
        const moveX = evt2.clientX + dx;
        const moveY = evt2.clientY + dy;

        gRef.current.setAttribute("transform", `translate(${moveX}, ${moveY})`);
        for (const sender of senders) {
          const cx = parseInt(senderRef.current.getAttribute("cx"));
          const cy = parseInt(senderRef.current.getAttribute("cy"));
          const r = parseInt(senderRef.current.getAttribute("r"));

          sender.setAttribute("x1", (moveX + cx + r).toString());
          sender.setAttribute("y1", (moveY + cy).toString());
        }
        for (const receiver of receivers) {
          const attr = (receiver as HTMLElement).dataset["receiverType"];
          const ref = receiverRefs.current.get(attr);
          receiver.setAttribute(
            "x2",
            (moveX + parseInt(ref.current.getAttribute("cx"))).toString()
          );
          receiver.setAttribute(
            "y2",
            (moveY + parseInt(ref.current.getAttribute("cy"))).toString()
          );
        }
      });
    };

    // eslint-disable-next-line
    const handleMouseUp: any = (evt2: MouseEvent) => {
      const x = evt2.clientX + dx;
      const y = evt2.clientY + dy;
      dispatch({ type: "MOVE_NODE", payload: { x, y, data } });

      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
  };

  // hexValue does not work
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
            {data.type === "ShaderModule" ? (
              <ShaderModulePanel uuid={data.uuid} body={data.body}>
                <></>
              </ShaderModulePanel>
            ) : data.type === "VertexState" ? (
              <VertexStatePanel uuid={data.uuid} body={data.body}>
                <></>
              </VertexStatePanel>
            ) : data.type === "FragmentState" ? (
              <FragmentStatePanel uuid={data.uuid} body={data.body}>
                <></>
              </FragmentStatePanel>
            ) : data.type === "RenderPipeline" ? (
              <RenderPipelinePanel uuid={data.uuid} body={data.body}>
                <></>
              </RenderPipelinePanel>
            ) : data.type === "CanvasPanel" ? (
              <CanvasPanel uuid={data.uuid} body={data.body}>
                <></>
              </CanvasPanel>
            ) : data.type === "CommandEncoder" ? (
              <CommandEncoderPanel uuid={data.uuid} body={data.body}>
                <></>
              </CommandEncoderPanel>
            ) : data.type === "RenderPass" ? (
              <RenderPassPanel uuid={data.uuid} body={data.body}>
                <></>
              </RenderPassPanel>
            ) : data.type === "DrawCall" ? (
              <DrawCallPanel uuid={data.uuid} body={data.body}>
                <></>
              </DrawCallPanel>
            ) : (
              (() => {
                console.error("Node.tsx fallthrough case");
                return (<div></div>)
              })()
            )}
          </div>
        </div>
      </foreignObject>
      <Sender
        svgRef={svgRef}
        sender={data.sender}
        senderRef={senderRef}
        width={data.size[0]}
      />
      {data.receivers &&
        data.receivers.map(
          (receiver: INodeReceiver<GPUObjectBase>, index: number) => {
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
          }
        )}
    </g>
  );
};

export default Node;
