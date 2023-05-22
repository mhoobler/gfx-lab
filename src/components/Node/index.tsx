import { NodeData, NODE_COLORS, NodeSender, NodeReceivers, INodeReceiver } from "../../data";
import React, {
  FC,
  RefObject,
  useContext,
  useRef,
} from "react";

import "./style.less";
import {
  VertexStatePanel,
  ShaderModulePanel,
  FragmentStatePanel,
  RenderPipelinePanel,
  NodeContext,
  CanvasPanel
} from "../../components";
import Reciever from "./Reciever";
import Sender from "./Sender";
import {relativeCoords} from "../../dnd";

type Props = { data: NodeData<any>; svgRef: RefObject<SVGElement> };

const Node: React.FC<Props> = ({ data, svgRef }) => {
  const { dispatch } = useContext(NodeContext);
  const foreignRef = useRef<SVGForeignObjectElement>(null);
  const gRef = useRef<SVGGElement>(null);

  const handleMouseDown = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (!svgRef.current || !gRef.current || !foreignRef.current) {
      throw new Error("Ref error");
    }

    let e = (evt as unknown) as MouseEvent;
    const [dx, dy] = relativeCoords(e);

    svgRef.current.removeChild(gRef.current);
    svgRef.current.appendChild(gRef.current);

    const handleMouseMove: any = (evt2: MouseEvent) => { // eslint-disable-line
      const moveX = evt2.clientX + dx;
      const moveY = evt2.clientY + dy;

      gRef.current.setAttribute("transform", `translate(${moveX}, ${moveY})`);
    };

    const handleMouseUp: any = (evt2: MouseEvent) => { // eslint-disable-line
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
        ref={foreignRef}
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
              <ShaderModulePanel
                body={data.body}
              >
              </ShaderModulePanel>
            ) : data.type === "VertexState" ? (
              <VertexStatePanel
                body={data.body}
              >
              </VertexStatePanel>
            ) : data.type === "FragmentState" ? (
              <FragmentStatePanel
                body={data.body}
              >
              </FragmentStatePanel>
            ) : data.type === "RenderPipeline" ? (
              <RenderPipelinePanel
                body={data.body}
              >
              </RenderPipelinePanel>
            ) : data.type === "CanvasPanel" ? ( 
              <CanvasPanel
                body={data.body}
              >
              </CanvasPanel>
            ) : (
              <p> Help </p>
            )}
          </div>
        </div>
      </foreignObject>
      <Connectors svgRef={svgRef} sender={data.sender} recievers={data.recievers}/>
    </g>
  );
};

type CProps = { svgRef: RefObject<SVGElement>, sender: NodeSender, recievers: NodeReceivers };
const Connectors: FC<CProps> = ({ svgRef, sender, recievers }) => {
  return ( 
    <>
      <Sender svgRef={svgRef} sender={sender} />
      {
        recievers && recievers.map((reciever: INodeReceiver<GPUObjectBase>) => (
          <Reciever svgRef={svgRef} key={JSON.stringify(reciever)} reciever={reciever} />
        ))
      }
    </>
         );
}

export default Node;
