import {Node, NodeContext} from "../../components";
import {NodeData} from "../../data";
import React, {useContext, useRef} from "react";

import "./style.less";

const NodeBoard: React.FC = () => {
  const { state } = useContext(NodeContext);
  const svgRef = useRef(null);

  return (
    <div className="node-board">
      <svg 
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg">
        {
          state.nodes.map((data: NodeData<any>) => {
            return <Node key={data.uuid} data={data} svgRef={svgRef} />
          })
        }
        <line x1="0" y1="80" x2="100" y2="100" stroke="black"/>
      </svg>
    </div>
  );
};

export default NodeBoard;
