import { default as NodeModules } from "./NodeModules";
import * as NodeTypes from "./Node/Node";

export module Node {
  export type Board = NodeTypes.Board;
  export type State = NodeTypes.State;
  export type Action = NodeTypes.Action;
  export type Context = NodeTypes.Context;
  export type Props<T> = NodeTypes.Props<T>;
  export type Receiver<T = unknown> = NodeTypes.Receiver<T>;
  export type Module<T = unknown> = NodeTypes.Module<T>;
  export type Instance<T = unknown> = NodeTypes.Instance<T>;
  export type Type = keyof typeof NodeModules;
  export type Connection = NodeTypes.Connection;

  export function init(uuid: string, position: number[], type: Type) {
    const node = structuredClone((NodeModules[type] as Module).default);
    node.uuid = uuid;
    node.position = position;

    return node;
  }

  export const Modules = NodeModules;
}

export * from "./Constants/Constants";
