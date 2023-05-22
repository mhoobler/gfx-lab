import {Node, NodeContext} from "../../components";
import {NodeData} from "../../data";
import React, {useContext} from "react";

import "./style.less";

const NodeBoard: React.FC = () => {
  const { state } = useContext(NodeContext);
  const nodes = state.getAllNodes();
  console.log(nodes);

  return (
    <div className="node-board">
      <svg 
        xmlns="http://www.w3.org/2000/svg">
        {
          nodes.map((data: NodeData<unknown>, i: number) => (
            <Node key={i} data={data} />
          ))
        }
      </svg>
    </div>
  );
};

export default NodeBoard;
