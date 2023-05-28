import { FC, RefObject } from "react";

type Props = {
  svgRef: RefObject<SVGElement>;
  receiver: NodeReceiver;
  receiverRef: RefObject<SVGCircleElement>;
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
      data-index={index}
      cx="8"
      cy={30 + 30 * index}
      r="10"
    />
  );
};

export default Receiver;
