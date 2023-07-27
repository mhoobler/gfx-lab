import { FC, RefObject, memo, useContext, useRef } from "react";
import { Node } from "data";
import { useDrag } from "hooks/useDrag";

import "./SVGNode.less";
import { NodeContext } from "contexts";

type Props = {
  instance: Node.Instance;
};
const SVGNode: FC<Props> = ({ instance }) => {
  const { uuid, size, type, position, label, resizable } = instance;
  const context = useContext(NodeContext);
  const [width, height] = size;
  const [x, y] = position;
  const gRef = useRef(null);
  const senderRef = useRef(null);

  const handleMouseDown = useDrag(gRef, senderRef, instance);

  let { backgroundColor, color, component: NodeBody } = Node.Modules[type];

  backgroundColor ||= "#FFF";
  color ||= "black";

  return (
    <g ref={gRef} transform={`translate(${x}, ${y})`}>
      <foreignObject width={width} height={height}>
        <div className="node-card col">
          <div
            className="node-card-header"
            onMouseDown={handleMouseDown}
            style={{ backgroundColor, color }}
          >
            {label}
          </div>
          <div className="node-card-body col">
            {/* passing context to NodeBody as property in order to avoid importing NodeContext */}
            {/* just feels like a good idea to keep them independant right now */}
            <NodeBody instance={instance} context={context} />
            {resizable && <div className="resizer"></div>}
          </div>
        </div>
      </foreignObject>
      <path
        transform={`translate(${width * 0.9}, 8) scale(.75)`}
        cx={width * 0.9}
        cy={8}
        r="10"
        d="M 0 14 L 0 25 C 0 28 0 28 2 26 L 10 17 C 12 14 12 14 10 11 L 2 2 C 0 0 0 0 0 3 Z"
        className="sender"
        data-uuid={uuid}
        onMouseDown={() => {}}
        ref={senderRef}
        fill="yellow"
        stroke={color}
        strokeWidth={2}
      />
    </g>
  );
};

export { SVGNode };
