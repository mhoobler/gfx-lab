import {
  NodeData,
  NODE_COLORS,
  NodeSender,
  NodeReceivers,
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
} from "../../components";
import Sender from "./Sender";
import Receiver from "./Receiver"
import { relativeCoords } from "../../dnd";

type Props = { data: NodeData<any>; svgRef: RefObject<SVGElement> };

const Node: React.FC<Props> = ({ data, svgRef }) => {
  const { dispatch } = useContext(NodeContext);
  const gRef = useRef<SVGGElement>(null);
  const senderRef = useRef<SVGCircleElement>(null);
  const receiverRefs = useRef<Map<string, RefObject<SVGCircleElement>>>(new Map());

  const handleMouseDown = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (!svgRef.current || !gRef.current || !senderRef.current) {
      throw new Error("Ref error");
    }

    let e = evt as unknown as MouseEvent;
    const [dx, dy] = relativeCoords(e);

    svgRef.current.removeChild(gRef.current);
    svgRef.current.appendChild(gRef.current);

    let senders = document.querySelectorAll(`.sender-${data.uuid}`);
    let receivers = document.querySelectorAll(`.receiver-${data.uuid}`);

    const handleMouseMove: any = (evt2: MouseEvent) => {
      window.requestAnimationFrame(() => {
      // eslint-disable-line
      const moveX = evt2.clientX + dx;
      const moveY = evt2.clientY + dy;


      gRef.current.setAttribute("transform", `translate(${moveX}, ${moveY})`);
      for(let sender of senders) {
        let cx = parseInt(senderRef.current.getAttribute("cx"));
        let cy = parseInt(senderRef.current.getAttribute("cy"));
        console.log(cx, cy);
        sender.setAttribute("x1", (moveX + cx).toString());
        sender.setAttribute("y1", (moveY + cy).toString());
      }
      for(let receiver of receivers) {
        let attr = (receiver as HTMLElement).dataset["receiverType"];
        let ref = receiverRefs.current.get(attr);
        receiver.setAttribute("x2", (moveX + parseInt(ref.current.getAttribute("cx"))).toString());
        receiver.setAttribute("y2", (moveY + parseInt(ref.current.getAttribute("cy"))).toString());
      }
      })
    };

    const handleMouseUp: any = (evt2: MouseEvent) => {
      // eslint-disable-line
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
  const backgroundColor = data.headerColor.rgbaValue();

  return (
    <g ref={gRef} transform={`translate(${data.xyz[0]}, ${data.xyz[1]})`}>
      <foreignObject
        width={data.size[0]}
        height={data.size[1]}
      >
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
              <ShaderModulePanel body={data.body}><></></ShaderModulePanel>
            ) : data.type === "VertexState" ? (
              <VertexStatePanel body={data.body}><></></VertexStatePanel>
            ) : data.type === "FragmentState" ? (
              <FragmentStatePanel body={data.body}><></></FragmentStatePanel>
            ) : data.type === "RenderPipeline" ? (
              <RenderPipelinePanel body={data.body}><></></RenderPipelinePanel>
            ) : data.type === "CanvasPanel" ? (
              <CanvasPanel body={data.body}><></></CanvasPanel>
            ) : (
              <p> Help </p>
            )}
          </div>
        </div>
      </foreignObject>
      <Sender svgRef={svgRef} sender={data.sender} senderRef={senderRef} width={data.size[0]}/>
      {data.receivers &&
        data.receivers.map((receiver: INodeReceiver<GPUObjectBase>, index: number) => {
        let f = createRef<any>();
        receiverRefs.current.set(receiver.type, f);
          return (<Receiver
            svgRef={svgRef}
            key={receiver.uuid + receiver.type}
            receiver={receiver}
            receiverRef={f}
            index={index}
          />)
        })}
    </g>
  );
};

export default Node;
