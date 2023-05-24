import { Connection, Node, NodeContext } from "../../components";
import { NodeConnection, NodeData } from "../../data";
import React, { useContext, useRef, useState } from "react";

import "./style.less";

const NodeBoard: React.FC = () => {
  const [count, setCount] = useState(0);
  const { state } = useContext(NodeContext);
  const svgRef = useRef(null);

  return (
    <div className="node-board">
      <svg xmlns="http://www.w3.org/2000/svg">
        <g ref={svgRef}>
        {state.nodes.map((data: NodeData<any>) => {
          return <Node key={data.sender.uuid} data={data} svgRef={svgRef} />;
        })}
        </g>
        {state.connections.map((conn: NodeConnection) => {
          console.log(conn);
          return (
            <Connection
              key={conn.sender.uuid + conn.receiver.uuid}
              conn={conn}
            />
          );
        })}
      </svg>
      <button onClick={() => setCount(count + 1)}></button>
    </div>
  );
};

export default NodeBoard;
