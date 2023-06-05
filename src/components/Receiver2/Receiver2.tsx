import { FC } from "react";

type Props = {
  receiver: NodeReceiver;
  children: React.ReactNode;
  index: number;
};

const Receiver2: FC<Props> = ({ receiver, children, index }) => {
  const iconStyle = {
    height: ".75rem",
    width: ".75rem",
    borderRadius: ".75rem",
    backgroundColor: "red",
    marginRight: ".5rem",
  };
  return (
    <div className="receiver2 row center-v">
      <div
        className="receiver receiver-icon"
        //ref={receiverRef}
        data-receiver-type={receiver.type}
        data-uuid={receiver.uuid}
        data-index={index}
        style={iconStyle}
      ></div>
      <div className="receiver-label">{children}</div>
    </div>
  );
};

export default Receiver2;
