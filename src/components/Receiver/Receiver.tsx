import { FC, ReactNode } from "react";
import { Node } from "data";
import "./Receiver.less";

type Props = {
  uuid: string;
  property: string;
  types: string[];
  index: number | null;
  objectKey: string | null;
  value: unknown;
  handleDelete?: (evt: React.MouseEvent) => void;
  handleKey?: () => void;
  children?: ReactNode;
};

const Receiver: FC<Props> = ({
  uuid,
  property,
  types,
  index,
  objectKey,
  value,
  handleDelete,
  handleKey,
  children,
}) => {
  const iconStyle = {
    background: "none",
  };
  if (value) {
    iconStyle.background = "yellow";
  }

  return (
    <div className="receiver row center-v">
      <div
        data-uuid={uuid}
        data-property={property}
        data-receiver-types={types}
        data-index={index}
        data-key={objectKey}
        className="receiver receiver-icon"
        style={iconStyle}
      ></div>
      <div className={`receiver-label`}>
        {children}
        {handleDelete && <button className="remove-receiver" name={property} value={index} onClick={handleDelete}>X</button>}
        {handleKey && <input type="text" value={objectKey} onChange={handleKey} />}
      </div>
    </div>
  );
};

export { Receiver };
