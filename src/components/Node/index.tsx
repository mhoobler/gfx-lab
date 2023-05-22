import { NodeData, NODE_COLORS } from "../../data";
import React, { MouseEvent, useRef } from "react";

import "./style.less";
import {VertexStatePanel, ShaderModulePanel, FragmentStatePanel, RenderPipelinePanel} from "../../components";

type Props = { data: NodeData<any> };

const Node: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGForeignObjectElement>(null);

  // TODO: Svg State Management
  function handleBodyEdit<T>(body: T, cb: unknown) {} // eslint-disable-line

  const handleMouseDown = (evt: React.MouseEvent<HTMLDivElement>) => {
    const downX = evt.clientX;
    const downY = evt.clientY;
    const bbX = evt.currentTarget.getBoundingClientRect().x;
    const bbY = evt.currentTarget.getBoundingClientRect().y;
    const dx = bbX - downX;
    const dy = bbY - downY;

    const handleMouseMove: any = (evt2: MouseEvent) => { // eslint-disable-line
      const moveX = evt2.clientX + dx;
      const moveY = evt2.clientY + dy;

      if (svgRef.current) {
        svgRef.current.setAttribute("x", moveX.toString());
        svgRef.current.setAttribute("y", moveY.toString());
      }
    };

    const handleMouseUp: any = () => { // eslint-disable-line
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
  };

  // hexValue does not work
  const backgroundColor = data.headerColor.rgbaValue();

  return (
    <g>
      <foreignObject ref={svgRef} x={20} y={20} width={data.width} height={data.height}>
        <div className="node-card">
          <div
            className="node-header"
            onMouseDown={handleMouseDown}
            style={{ backgroundColor }}
          >
            Hello
          </div>
          <div className="node-body">
            {
              data.headerColor === NODE_COLORS.ShaderModule ?
                <ShaderModulePanel body={data.body} handleBodyEdit={handleBodyEdit} />
              :
              data.headerColor === NODE_COLORS.VertexState ?
                <VertexStatePanel body={data.body} handleBodyEdit={handleBodyEdit} />
              :
              data.headerColor === NODE_COLORS.FragmentState ?
                <RenderPipelinePanel body={data.body} handleBodyEdit={handleBodyEdit} />
              :
              data.headerColor === NODE_COLORS.RenderPipeline ?
                <FragmentStatePanel body={data.body} handleBodyEdit={handleBodyEdit} />
              :
                <p> Help </p>
            }
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

export default Node;
