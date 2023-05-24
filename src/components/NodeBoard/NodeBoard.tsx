import { Connection, Node, NodeContext } from "../../components";
import { NodeConnection, NodeData } from "../../data";
import React, { useContext, useRef, useState } from "react";

import "./style.less";

let bool = false;

const NodeBoard: React.FC = () => {
  const { state, dispatch } = useContext(NodeContext);
  const svgRef = useRef(null);

  console.log(bool);
  if (!bool && state.nodes) {
    let shaderNode = state.nodes.find((node) => node.type === "ShaderModule");

    let vertexNode: NodeData<GPUVertexState> = state.nodes.find(
      (node) => node.type === "VertexState"
    );
    let fragmentNode: NodeData<GPUFragmentState> = state.nodes.find(
      (node) => node.type === "FragmentState"
    );
    let pipelineNode: NodeData<GPURenderPipelineDescriptor> = state.nodes.find(
      (node) => node.type === "RenderPipeline"
    );
    let canvasNode: NodeData<GPUCanvasPanel> = state.nodes.find(
      (rec) => rec.type === "CanvasPanel"
    );
    let renderPassNode: NodeData<GPURenderPassDescriptorEXT> = state.nodes.find(
      (rec) => rec.type === "RenderPass"
    );
    let commandEncoderNode: NodeData<GPUCommandEncoderDescriptorEXT> = state.nodes.find(
      (rec) => rec.type === "CommandEncoder"
    )
    let drawCallNode: NodeData<GPUCommandEncoderDescriptorEXT> = state.nodes.find(
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

    //let pipelineNode: NodeData<GPURenderPipelineDescriptor> = state.nodes.find(
    //  (node) => node.type === "RenderPipeline"
    //);

    //// Connect VertexState to Pipeline
    //let pipelineReceiver = pipelineNode.receivers.find(
    //  (rec) => rec.type === "VertexState"
    //);
    //dispatch({
    //  type: "LINK_SENDER_NODE",
    //  payload: { sender: vertexNode.sender, recieverId: pipelineReceiver.uuid },
    //});

    // Connect FragmentState to Pipeline
    //pipelineReceiver = pipelineNode.receivers.find(
    //  (rec) => rec.type === "FragmentState"
    //);
    //dispatch({
    //  type: "LINK_SENDER_NODE",
    //  payload: {
    //    sender: fragmentNode.sender,
    //    recieverId: pipelineReceiver.uuid,
    //  },
    //});

    bool = true;
  }

  const handleClick = () => {
    console.log("click");
    dispatch({type:"RENDER", payload: null});
  }

  return (
    <div className="node-board">
      <button onClick={handleClick}>DRAW</button>
      <svg xmlns="http://www.w3.org/2000/svg">
        <g ref={svgRef}>
          {state.nodes.map((data: NodeData<any>) => {
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
