import { NODE_TYPE_PRIORITY } from "data";

export type Type = (typeof NODE_TYPE_PRIORITY)[number] | null;

export type ContextState = {
  zoom: n;
  viewBox: n[];
  renderState: boolean;
  nodes: Default[];
  connections: Connection[];
  selectedLayout: { url: string; name: string };
};

export type Receiver = {
  uuid: string;
  type: Type;
  from: Data<GPUBase, Receivers> | null;
};
export type Receivers<K extends Type = Type> = {
  [key in K]: Receiver[];
};

export type Sender = {
  uuid: string;
  type: Type;
  value: GPUBase;
  to: Set<Data<GPUBase, Receivers>>;
};

export type Connection = {
  sender: {
    uuid: Type;
    xyz: [n, n, n];
  };
  receiver: {
    type: Type;
    uuid: string;
    index: n;
    xyz: [n, n, n];
  };
};
type ConnectionJson = { uuid: string; receiverIndex: number };

export type Base = {
  uuid: string;
  type: Type;
  headerColor: IColor;
  xyz: [n, n, n];
  size: [n, n];
};
export type Data<T, K extends Receivers<Type> = null> = Base & {
  body: T;
  sender: Sender;
  receivers: K;
};
export type Default = Data<GPUBase, Receivers | null>;

export type Json = {
  uuid: string;
  type: Type;
  xyz: [n, n, n];
  size?: [n, n];
  body?: object;
  connections?: ConnectionJson[];
};

export type InitFn<T> = (uuid: string, xyz: [n, n, n]) => T;
