import React, { createContext, FC, useEffect, useState } from "react";

type WgpuState = {
  device?: GPUDevice;
  format?: GPUTextureFormat;
  adapter?: GPUAdapter;
  error?: Error;
};

const initState: WgpuState = {};

const WgpuContext = createContext(initState);
const { Provider } = WgpuContext;

const WgpuProvider: FC<DefaultProps> = ({ children }) => {
  const [device, setDevice] = useState<GPUDevice>(undefined);
  const [format, setFormat] = useState<GPUTextureFormat>(undefined);
  const [adapter, setAdapter] = useState<GPUAdapter>(undefined);
  const [error, setError] = useState<Error>(undefined);

  useEffect(() => {
    let error: Error;

    if (!navigator.gpu) {
      error = new Error("WebGPU not supported.");
      setError(error);
      throw error;
    }
    setFormat(navigator.gpu.getPreferredCanvasFormat());

    if (adapter === undefined) {
      navigator.gpu
        .requestAdapter({ powerPreference: "high-performance" })
        .then((adapter) => {
          adapter
            .requestAdapterInfo()
            .then((info) => console.log(info))
            .catch((err) => console.warn("Error at requestAdapterInfo:", err));

          setAdapter(adapter);
        })
        .catch((err) => {
          error = err;
          setError(error);
          throw err;
        });
    }

    if (adapter && device === undefined) {
      adapter
        .requestDevice()
        .then((device) => setDevice(device))
        .catch((err) => {
          error = err;
          setError(error);
          throw err;
        });
    }
  }, [device, adapter, error]);
  return (
    <Provider value={{ device, format, adapter, error }}>{children}</Provider>
  );
};

export { WgpuProvider, WgpuContext };
