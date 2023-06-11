import { FC, useContext, useEffect, useRef, useState } from "react";
import {
  Connection,
  NodeSVG,
  NodeContext,
  NodeToolbar,
  NodeInitFn,
} from "components";

import "./NodeBoard.less";
import { viewBoxCoords, Node } from "data";

const NodeBoard: FC = () => {
  const { state, dispatch } = useContext(NodeContext);
  const [view, setView] = useState({
    zoom: 1.5,
    viewBox: [0, 0, window.innerWidth * 1.5, window.innerHeight * 1.5],
  });
  const [dialog, setDialog] = useState({
    open: false,
    position: [0, 0],
  });
  const svgRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleResize = (evt: Event) => {
      setView(({ zoom, viewBox }) => {
        const { innerWidth, innerHeight } = evt.currentTarget as Window;
        const vb = [...viewBox];
        return {
          zoom,
          viewBox: [vb[0], vb[1], innerWidth * zoom, innerHeight * zoom],
        };
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleWheel = (evt: React.WheelEvent) => {
    if (evt.buttons === 0 && evt.target === svgRef.current) {
      setView(({ viewBox, zoom }) => {
        const [x, y, width, height] = [...viewBox];
        const zoomFactor = evt.deltaY > 0 ? 1.1 : 0.9;
        const zm = zoom * zoomFactor;
        const [uvx, uvy] = viewBoxCoords(evt.clientX, evt.clientY, { viewBox });

        const [newWidth, newHeight] = [
          window.innerWidth * zm,
          window.innerHeight * zm,
        ];
        const [dx, dy] = [uvx - x, uvy - y];
        const newX = x - (dx / width) * (newWidth - width);
        const newY = y - (dy / height) * (newHeight - height);

        return {
          zoom: zm,
          viewBox: [newX, newY, newWidth, newHeight],
        };
      });
    }
  };

  const handleMouseDown = (evt: React.MouseEvent) => {
    if (evt.button === 0 && evt.target === svgRef.current) {
      let y = dialogRef.current.getBoundingClientRect();
      return setDialog({
        open: true,
        position: [evt.clientX, evt.clientY],
      });
    }
    if (evt.button === 1 && svgRef.current) {
      document.body.style.cursor = "grabbing";

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
        document.body.style.cursor = "";
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
    setDialog({
      open: false,
      position: [evt.clientX, evt.clientY],
    });
  };

  const handleCreateNode = (type: Node.Type) => {
    let [x, y] = viewBoxCoords(dialog.position[0], dialog.position[1], view);
    
    dispatch({
      type: "CREATE_NODE",
      payload: { type, xyz: [x, y, state.nodes.length] },
    });
    setDialog(state => ({
      ...state,
      open: false,
    }));
  };

  return (
    <div className="node-board">
      <svg
        ref={svgRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        viewBox={`${view.viewBox.join(" ")}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {state.connections.map((conn: Node.Connection) => {
          return (
            <Connection
              key={conn.sender.uuid + conn.receiver.uuid}
              conn={conn}
              view={view}
            />
          );
        })}
        {state.nodes.map((data: Node.Data<GPUBase>) => {
          return (
            <NodeSVG
              key={data.sender.uuid}
              data={data}
              svgRef={svgRef}
              view={view}
            />
          );
        })}
      </svg>
      <NodeToolbar />
      <dialog
        ref={dialogRef}
        open={dialog.open}
        style={{ left: dialog.position[0], top: dialog.position[1] }}
      >
        <div className="col">
          {Object.keys(NodeInitFn).map((str) => {
            return (
              <button onClick={() => handleCreateNode(str)}>
                {str}
              </button>
            );
          })}
        </div>
      </dialog>
    </div>
  );
};

export default NodeBoard;
