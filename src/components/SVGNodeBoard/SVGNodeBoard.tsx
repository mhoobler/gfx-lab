import { Node } from "data";
import { SVGNode } from "components/SVGNode/SVGNode";
import { FC, useContext, useState } from "react";
import { NodeContext } from "contexts";

const SVGNodeBoard: FC = () => {
  const [zoom, setZoom] = useState(1);
  const [viewBox, setViewBox] = useState([
    0,
    0,
    window.innerWidth,
    window.innerHeight,
  ]);
  const {
    state: { nodes },
  } = useContext(NodeContext);

  return (
    <svg viewBox={viewBox.join(" ")} xmlns="https://www.w3.org/2000/svg">
      {Object.values(nodes).map((instance: Node.Instance) => {
        return <SVGNode key={instance.uuid} instance={instance} />;
        //const Body =
        //return <SVGNode instance={instance}></SVGNode>
      })}
    </svg>
  );
};

export { SVGNodeBoard };
