import { FC } from "react";
import { Node } from "data";

import "./Receiver.less";

type Props = {
  index: number;
  receiver: Node.Receiver;
  handleDelete?: () => void;
  children: React.ReactNode;
};

const Receiver: FC<Props> = ({ index, receiver, handleDelete, children }) => {
  const iconStyle = {
    background: receiver.from ? "yellow" : "none",
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
      <div className="receiver-label">
        {handleDelete ? <button onClick={handleDelete}>X</button> : <></>}
        {children}
      </div>
    </div>
  );
};

export default Receiver;
