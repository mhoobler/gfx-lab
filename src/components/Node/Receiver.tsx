import React, { FC, RefObject } from "react";
import { INodeReceiver } from "data";

type Props = {
  svgRef: RefObject<SVGElement>;
  receiver: INodeReceiver<GPUObjectBase>;
  receiverRef: any;
  index: number;
};
const Receiver: FC<Props> = ({ receiver, index, receiverRef }) => {
  return (
    <circle
      ref={receiverRef}
      style={{ filter: "" }}
      className="receiver"
      data-receiver-type={receiver.type}
      data-uuid={receiver.uuid}
      cx="10"
      cy={40 + 40 * index}
      r="10"
    />
  );
};

export default Receiver;
