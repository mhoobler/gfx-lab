import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import Connection from "./Connection";

it("renders Connection with important data attributes", () => {
  const conn: NodeConnection = {
    sender: {
      uuid: "1",
      xyz: [0, 0, 0],
    },
    receiver: {
      uuid: "2",
      type: "GPUVertexState",
      xyz: [0, 0, 0],
    },
  };

  const { container } = render(
    <svg>
      <Connection conn={conn} />
    </svg>
  );

  // These attributes are used in other areas of the codebase, see Node
  expect(container.querySelector("line").dataset["senderId"]).toBe("1");
  expect(container.querySelector("line").dataset["receiverId"]).toBe("2");
  expect(container.querySelector("line").dataset["receiverType"]).toBe(
    "GPUVertexState"
  );
});
