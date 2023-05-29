import { Connection, Node, NodeContext } from "../../components";
import { FC, useContext, useEffect, useRef, useState } from "react";

import "./style.less";
import { viewBoxCoords } from "data";

const NodeBoard: FC = () => {
  const { state, dispatch } = useContext(NodeContext);
  const [view, setView] = useState({
    zoom: 1,
    viewBox: [0, 0, window.innerWidth, window.innerHeight],
  });
  const svgRef = useRef(null);
  const gRef = useRef(null);

  useEffect(() => {
    const handleResize = (evt: Event) => {
      setView(({zoom, viewBox}) => {
        const { innerWidth, innerHeight } = evt.currentTarget as Window;
        let vb = [...viewBox];
        return {
          zoom,
          viewBox: [vb[0], vb[1], innerWidth * zoom, innerHeight * zoom ],
        };
      });
    };
    window.addEventListener("resize", handleResize);

    console.log("INIT NODES");
    const shaderNode = state.nodes.find((node) => node.type === "ShaderModule");

    const vertexNode: NodeData<GPUVertexState> = state.nodes.find(
      (node) => node.type === "VertexState"
    );
    const fragmentNode: NodeData<GPUFragmentState> = state.nodes.find(
      (node) => node.type === "FragmentState"
    );
    const pipelineNode: NodeData<GPURenderPipelineDescriptor> =
      state.nodes.find((node) => node.type === "RenderPipeline");
    const canvasNode: NodeData<GPUCanvasPanel> = state.nodes.find(
      (rec) => rec.type === "CanvasPanel"
    );
    const renderPassNode: NodeData<GPURenderPassDescriptorEXT> =
      state.nodes.find((rec) => rec.type === "RenderPass");
    const commandEncoderNode: NodeData<GPUCommandEncoderDescriptorEXT> =
      state.nodes.find((rec) => rec.type === "CommandEncoder");
    const drawCallNode: NodeData<GPUCommandEncoderDescriptorEXT> =
      state.nodes.find((rec) => rec.type === "DrawCall");

    dispatch({
      type: "LINK_MULTIPLE_NODES",
      payload: [
        // Connect ShaderModule to VertexState
        {
          sender: shaderNode.sender,
          receiverId: vertexNode.uuid,
          receiverIndex: 0,
        },
        // Connect ShaderModule to FragmentState
        {
          sender: shaderNode.sender,
          receiverId: fragmentNode.uuid,
          receiverIndex: 0,
        },
        // Connect VertexState to Pipeline
        {
          sender: vertexNode.sender,
          receiverId: pipelineNode.uuid,
          receiverIndex: 0,
        },
        // Connect FragmentState to Pipeline
        {
          sender: fragmentNode.sender,
          receiverId: pipelineNode.uuid,
          receiverIndex: 1,
        },
        // Connect CanvasPanel to RenderPass
        {
          sender: canvasNode.sender,
          receiverId: renderPassNode.uuid,
          receiverIndex: 0,
        },
        // Connect RenderPass to CommandEncoder
        {
          sender: renderPassNode.sender,
          receiverId: commandEncoderNode.uuid,
          receiverIndex: 0,
        },
        // Connect Pipeline to DrawCall
        {
          sender: pipelineNode.sender,
          receiverId: drawCallNode.uuid,
          receiverIndex: 0,
        },
      ],
    });
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleRenderClick = () => {
    dispatch({ type: "RENDER", payload: null });
  };

  const handleWheel = (evt: React.WheelEvent) => {
    if (evt.buttons === 0) {
      setView(({ viewBox, zoom }) => {
        const [x, y, width, height] = [...viewBox];
        const zoomFactor = evt.deltaY > 0 ? 1.1 : 0.9;
        const zm = Math.round(zoom * zoomFactor * 100) / 100;
        const [uvx, uvy] = viewBoxCoords(evt.clientX, evt.clientY, { viewBox });

        let [newWidth, newHeight] = [window.innerWidth * zm, window.innerHeight * zm];
        let [dx, dy] = [uvx - x, uvy - y];
        let newX = x - (dx / width) * (newWidth - width);
        let newY = y - (dy / height) * (newHeight - height);

        return {
          zoom: zm,
          viewBox: [newX, newY, newWidth, newHeight],
        };
      });
    }
  };

  const handleSvgDown = (evt: React.MouseEvent) => {
    if (evt.button === 1 && svgRef.current) {
      let [mx, my] = viewBoxCoords(evt.clientX, evt.clientY, view);
      const mousemove = (evt2: MouseEvent) => {
        const [moveX, moveY] = viewBoxCoords(evt2.clientX, evt2.clientY, view);
        const vb = svgRef.current
          .getAttribute("viewBox")
          .split(" ")
          .map(parseFloat);

        vb[0] += mx - moveX;
        vb[1] += my - moveY;
        svgRef.current.setAttribute("viewBox", vb.join(" "));

        mx = moveX;
        my = moveY;
      };
      const mouseup = (evt2: MouseEvent) => {
        if (evt2.button === 1) {
          setView((state) => {
            return {
              ...state,
              viewBox: svgRef.current
                .getAttribute("viewBox")
                .split(" ")
                .map(parseFloat),
            };
          });
          window.removeEventListener("mousemove", mousemove);
          window.removeEventListener("mouseup", mouseup);
        }
      };

      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
    }
  };

  return (
    <div className="node-board">
      <button onClick={handleRenderClick}>DRAW</button>
      <svg
        ref={svgRef}
        onWheel={handleWheel}
        onMouseDown={handleSvgDown}
        viewBox={`${view.viewBox.join(" ")}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g ref={gRef}>
          {state.nodes.map((data: NodeData<unknown>) => {
            return (
              <Node
                key={data.sender.uuid}
                data={data}
                svgRef={gRef}
                view={view}
              />
            );
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
