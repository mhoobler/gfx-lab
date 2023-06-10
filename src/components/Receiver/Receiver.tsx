import { FC } from "react";

import "./Receiver.less";

type Props = {
  receiver: NodeReceiver;
  children: React.ReactNode;
  index: number;
};

const Receiver: FC<Props> = ({ receiver, children, index }) => {
  const iconStyle = {
    background: receiver.from ? "yellow" : "none"
  };

  return (
    <div className="receiver row center-v">
      <div
        className="receiver receiver-icon"
        data-receiver-type={receiver.type}
        data-uuid={receiver.uuid}
        data-type={receiver.type}
        data-index={index}
        style={iconStyle}
      ></div>
      <div className="receiver-label">{children}</div>
    </div>
  );
};

export default Receiver;
