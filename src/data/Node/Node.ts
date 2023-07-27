import { ChangeEvent, FC, MouseEvent } from "react";

export type Board = {
  name: string,
  zoom: number,
  viewBox: number[],
  nodes: { [key: string]: Instance },
  connections: Connection[],
}

export type State = {
  nodes: { [key: string]: Instance };
  connections: Connection[];
  senderValues: { [key: string]: unknown };
  device: GPUDevice;
};

export type Action =
  | { type: "TEST"; payload: string }
  | {
      type: "EDIT_NODE";
      payload: Instance<unknown>;
    }
  | { 
    type: "ADD_NODE";
    payload: Instance<unknown>
  };

export type Context = {
  state: State;
  dispatch: (_: Action) => void;
  handleTextInput: (i: Instance<unknown>) => (evt: ChangeEvent) => void;
  handleNumberInput: (i: Instance<unknown>) => (evt: ChangeEvent) => void;
  handleAddIndex: (i: Instance<unknown>) => (evt: MouseEvent) => void;
  handleDeleteIndex: (i: Instance<unknown>) => (evt: MouseEvent) => void;
};

export type Props<T> = {
  instance: Instance<T>;
  context: Context;
};

export type Receiver<T = unknown> = [string[], keyof T, "key" | "index" | null];

export type Module<T = unknown> = {
  sender: (state: any, node: Instance<T>) => unknown;
  backgroundColor?: string,
  color?: string,
  component: FC<Props<T>>;
  default: Instance<T>;
  json: (node: Instance<T>) => { [K in keyof T]?: T[K] };
  receivers: Receiver<T>[];
};

export type Instance<T = unknown> = {
  uuid: string;
  label: string;
  type: string;
  position: number[];
  size: number[];
  body: T;
  resizable?: boolean;
};

type SenderID = string;
type ReceiverID = string;
type PropertyAccessor = string;
type Index = number;
type Key = string;
export type Connection = [
  SenderID,
  ReceiverID,
  PropertyAccessor,
  Index | Key | null
];

export function init(uuid: string, position: number[], type: Type) {
  const node = structuredClone((NodeModules[type] as Module).default);
  node.uuid = uuid;
  node.position = position;

  return node;
}
