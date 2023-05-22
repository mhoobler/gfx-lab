import React, {FC, RefObject} from "react";
import {INodeReceiver} from "data";

type Props = { svgRef: RefObject<SVGElement>, reciever: INodeReceiver<GPUObjectBase> }
const Reciever: FC<Props> = ({ reciever }) => {
  return (
    <circle style={{filter: ""}} className="reciever" data-reciever-type={reciever.type} cx="10" cy="40" r="10" />
  );
}

export default Reciever;
