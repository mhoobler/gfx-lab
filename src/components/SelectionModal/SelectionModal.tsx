import { FC, useEffect, useState } from "react";

type Props = {
  items: string[];
  handleSelect: (s: string) => void;
  children: React.ReactNode;
};

const SelectionModal: FC<Props> = ({ items, handleSelect, children }) => {
  const [showSelection, setShowSelection] = useState(0);

  useEffect(() => {
    // If showSelection is open, and user clicks anywhere else on the app, close the showSelection
    const hideSelection = () => {
      setShowSelection((state) => {
        if (state === 0) {
          return 0;
        }
        return (state + 1) % 3;
      });
    };
    window.addEventListener("click", hideSelection);

    return () => window.removeEventListener("click", hideSelection);
  }, [showSelection]);

  if (showSelection > 0) {
      return (<div className="col">
        {items.map((item) => (
          <button key={item} onClick={() => handleSelect(item)}>{item}</button>
        ))}
      </div>)
  }
  return <button onClick={() => setShowSelection(1)}>{children}</button>
};

export default SelectionModal;
