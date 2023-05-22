import React, {FC} from "react";

type Props = PanelProps<GPUFragmentState>;

const FragmentStatePanel: FC<Props> = ({ body, children }) => {
  console.log(body);
  return (
    <div>
      {children}
    </div>
  );
}

export default FragmentStatePanel;
