import NodeManager from "./NodeManager";

const nodeReducer = (state: NodeContextState, test: number, action: any) => { // eslint-disable-line
  // TODO: Svg State Management
  const { type, payload } = action;

  switch(type) {
    case "MOVE_NODE": {
      return state;
    }
    default: {
      console.error(`nodeReducer default case`, action);
      return state;
    }
  }
}

export default nodeReducer;

