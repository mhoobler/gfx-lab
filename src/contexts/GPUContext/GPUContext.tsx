import { createContext, FC, ReactNode } from "react";

type Context = {
  adapter: GPUAdapter;
  device: GPUDevice;
  format: GPUTextureFormat;
};
const initContext: Context = {
  adapter: null,
  device: null,
  format: null,
};

const GPUContext = createContext(initContext);
const { Provider } = GPUContext;

type Props = Context & {
  children: ReactNode;
};
const GPUProvider: FC<Props> = ({ children, device, format, adapter }) => {
  return <Provider value={{ device, format, adapter }}>{children}</Provider>;
};

export { GPUProvider, GPUContext };
