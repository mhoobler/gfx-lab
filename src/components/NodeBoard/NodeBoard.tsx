import { Connection, Node, NodeContext } from "../../components";
import { NodeConnection, NodeData } from "../../data";
import React, { useContext, useEffect, useRef } from "react";

import "./style.less";

const NodeBoard: React.FC = () => {
  const { state, dispatch } = useContext(NodeContext);
  const svgRef = useRef(null);

  useEffect(() => {
    console.log("INIT NODES");
    const shaderNode = state.nodes.find((node) => node.type === "ShaderModule");

    const vertexNode: NodeData<GPUVertexState> = state.nodes.find(
      (node) => node.type === "VertexState"
    );
    const fragmentNode: NodeData<GPUFragmentState> = state.nodes.find(
      (node) => node.type === "FragmentState"
    );
    const pipelineNode: NodeData<GPURenderPipelineDescriptor> = state.nodes.find(
      (node) => node.type === "RenderPipeline"
    );
    const canvasNode: NodeData<GPUCanvasPanel> = state.nodes.find(
      (rec) => rec.type === "CanvasPanel"
    );
    const renderPassNode: NodeData<GPURenderPassDescriptorEXT> = state.nodes.find(
      (rec) => rec.type === "RenderPass"
    );
    const commandEncoderNode: NodeData<GPUCommandEncoderDescriptorEXT> = state.nodes.find(
      (rec) => rec.type === "CommandEncoder"
    )
    const drawCallNode: NodeData<GPUCommandEncoderDescriptorEXT> = state.nodes.find(
      (rec) => rec.type === "DrawCall"
    )

    dispatch({
      type: "LINK_MULTIPLE_NODES",
      payload: [
        // Connect ShaderModule to VertexState
        { sender: shaderNode.sender, receiverId: vertexNode.uuid },
        // Connect ShaderModule to FragmentState
        { sender: shaderNode.sender, receiverId: fragmentNode.uuid },
        // Connect VertexState to Pipeline
        { sender: vertexNode.sender, receiverId: pipelineNode.uuid },
        // Connect FragmentState to Pipeline
        { sender: fragmentNode.sender, receiverId: pipelineNode.uuid },
        // Connect CanvasPanel to RenderPass
        { sender: canvasNode.sender, receiverId: renderPassNode.uuid },
        // Connect RenderPass to CommandEncoder
        { sender: renderPassNode.sender, receiverId: commandEncoderNode.uuid },
        // Connect Pipeline to DrawCall
        { sender: pipelineNode.sender, receiverId: drawCallNode.uuid },
      ],
    });
  }, []);

  const handleClick = () => {
    dispatch({type:"RENDER", payload: null});
  }

  return (
    <div className="node-board">
      <button onClick={handleClick}>DRAW</button>
      <svg xmlns="http://www.w3.org/2000/svg">
        <g ref={svgRef}>
          {state.nodes.map((data: NodeData<unknown>) => {
            return <Node key={data.sender.uuid} data={data} svgRef={svgRef} />;
          })}
        </g>
        {state.connections.map((conn: NodeConnection) => {
          return (
            <Connection
              key={conn.sender.uuid + conn.receiver.uuid}
              conn={conn}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default NodeBoard;