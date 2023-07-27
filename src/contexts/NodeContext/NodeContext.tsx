import { GPUContext } from "contexts/GPUContext/GPUContext";
import { Node } from "data";
import {
  ChangeEvent,
  MouseEvent,
  Provider,
  createContext,
  useContext,
  useReducer,
} from "react";

const reducer = (state: Node.State, { type, payload }: Node.Action) => {
  switch (type) {
    case "EDIT_NODE": {
      const { uuid } = payload;

      return {
        ...state,
        nodes: {
          ...state.nodes,
          [uuid]: structuredClone(payload)
        },
      };
    }
    default: {
      return state;
    }
  }
};

const NodeContext = createContext({} as Node.Context);
const { Provider } = NodeContext;

const NodeProvider = ({ children, initState }) => {
  const { device } = useContext(GPUContext);
  const [state, dispatch] = useReducer(reducer, { ...initState, device });

  // Need to standarize inputs for NodeModule 
  // so we don't have to change dozens of files for simple tasks
  const handleTextInput =
    (instance: Node.Instance) =>
    (evt: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = evt.target;
      instance.body[name] = value;
      dispatch({ type: "EDIT_NODE", payload: instance });
    };

  const handleNumberInput =
    (instance: Node.Instance) => (evt: ChangeEvent<HTMLInputElement>) => {
      const { value, name } = evt.target;
      const i = parseInt(value);
      if (!isNaN(i)) {
        instance.body[name] = i;
        dispatch({ type: "EDIT_NODE", payload: instance });
      }
    };

  const handleAddIndex = (instance: Node.Instance) => (evt: MouseEvent) => {
    console.log("F")
    const { name } = evt.target as HTMLButtonElement;
    instance.body[name] = [...instance.body[name], null];
    dispatch({ type: "EDIT_NODE", payload: instance });
  };

  const handleDeleteIndex = (instance: Node.Instance) => (evt: MouseEvent) => {
    const { name, value } = evt.currentTarget as HTMLButtonElement;
    const index = parseInt(value);

    instance.body[name] = instance.body[name].filter(
      (_: unknown, i: number) => i !== index
    );
    dispatch({ type: "EDIT_NODE", payload: instance });
  };

  return (
    <Provider
      value={{
        state,
        dispatch,
        handleTextInput,
        handleNumberInput,
        handleAddIndex,
        handleDeleteIndex,
      }}
    >
      {children}
    </Provider>
  );
};

export { NodeContext, NodeProvider };
