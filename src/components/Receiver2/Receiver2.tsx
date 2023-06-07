import { FC } from "react";

type Props = {
  receiver: NodeReceiver;
  children: React.ReactNode;
  index: number;
};

const Receiver2: FC<Props> = ({ receiver, children, index }) => {
  const iconStyle = {
    height: ".375rem",
    width: ".375rem",
    borderRadius: ".375rem",
    border: ".125rem solid yellow",
    marginRight: ".5rem",
    background: receiver.from ? "yellow" : "none"
  };

  return (
    <div className="receiver2 row center-v">
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

export default Receiver2;
