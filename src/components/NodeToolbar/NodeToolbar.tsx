import { FC, useContext, useEffect } from "react";
import { NodeContext } from "components";

const NodeToolbar: FC = () => {
  const { state, dispatch } = useContext(NodeContext);
  const { selectedLayout, renderState } = state;

  useEffect(() => {
    const initUrl = "json_layouts/hello_vertex.json";

    fetch(initUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        dispatch({ type: "LOAD_LAYOUT", payload: { data, url: initUrl } });
      })
      .catch((err) => console.error(err));
  }, []);

  const handleRenderClick = () => {
    dispatch({ type: "RENDER" });
  };

  const handleLayoutChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = evt.target;

    switch (value) {
      case selectedLayout.url: {
        break;
      }
      case "CLEAR": {
        if (window.confirm("Are you sure you want to clear the board?")) {
          dispatch({ type: "CLEAR" });
        }
        break;
      }
      default: {
        if (
          window.confirm(
            "Are you sure you want to load this layout? Your progress will not be saved."
          )
        ) {
          fetch(value)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              dispatch({ type: "CLEAR" });
              setTimeout(() => {
                dispatch({ type: "LOAD_LAYOUT", payload: { data, url: value } });
              }, 1);
            })
            .catch((err) => console.error(err));
        }
      }
    }
  };

  const handleSave = () => {
    dispatch({ type: "SAVE_LAYOUT" });
  };

  const handleLoadFile = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const fr = new FileReader();
    const value = evt.target.value;
    fr.onload = () => {
      const data = JSON.parse(fr.result as string);
      dispatch({ type: "CLEAR" });
      setTimeout(() => {
        dispatch({ type: "LOAD_LAYOUT", payload: { data, url: value } });
      }, 1)
    };
    fr.readAsText(evt.target.files[0]);
  };

  return (
    <div className="board-controls">
      <input type="file" onChange={handleLoadFile} />
      <select onChange={handleLayoutChange} value={selectedLayout.url}>
        <option value="CLEAR">Clear</option>
        <option value={`json_layouts/hello_instance.json`}>Hello Instance</option>
        <option value={`json_layouts/hello_vertex.json`}>Hello Vertex</option>
      </select>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleRenderClick}>
        {renderState ? "Pause" : "Start Render"}
      </button>
    </div>
  );
};

export default NodeToolbar;
