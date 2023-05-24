import React, {FC} from "react";

type Props = PanelProps<GPUFragmentState>;

const FragmentStatePanel: FC<Props> = ({ body, children }) => {
  return (
    <div>
      {children}
    </div>
  );
}

export default FragmentStatePanel;
