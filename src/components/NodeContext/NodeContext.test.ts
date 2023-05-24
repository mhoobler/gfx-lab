import { createConnection, removeConnection } from "../../node_utils";
import { NodeFactory } from "../../data";
import NodeManager from "./NodeManager";

it("creates and deletes a NodeConnection", () => {
  let manager = new NodeManager();

  let shaderModule = NodeFactory.ShaderModule("1", [200, 200, 0], {
    label: "ShaderModule",
    code: "",
  });
  manager.shaderModules.push(shaderModule);

  let vertexState = NodeFactory.VertexState("2", [0, 200, 1], {
    label: "VertexState",
    module: null,
    entryPoint: "vs",
  });
  manager.vertexStates.push(vertexState);

  let sender = shaderModule.sender;
  let receiver = vertexState.receivers[0];
  let receiverId = vertexState.uuid;

  createConnection(manager, sender, receiverId);
  expect(sender.to.size).toBe(1);
  expect(receiver.from).not.toBeFalsy();

  removeConnection(manager, "2", "GPUShaderModule");
  expect(sender.to.size).toBe(0);
  expect(receiver.from).toBeFalsy();
});

it("throws an error while trying to form invalid NodeConnection", () => {
  let manager = new NodeManager();

  let shaderModule = NodeFactory.ShaderModule("1", [200, 200, 0], {
    label: "ShaderModule",
    code: "",
  });
  manager.shaderModules.push(shaderModule);

  let vertexState = NodeFactory.VertexState("2", [0, 200, 1], {
    label: "VertexState",
    module: null,
    entryPoint: "vs",
  });
  manager.vertexStates.push(vertexState);

  let sender = shaderModule.sender;
  sender.uuid = "40";
  let receiverId = vertexState.uuid;

  expect(() => {
    createConnection(manager, sender, receiverId);
  }).toThrow(`Could not find senderNode with uuid: ${sender.uuid}`);
});

it("throws an error while trying to form invalid NodeConnection", () => {
  let manager = new NodeManager();

  let shaderModule = NodeFactory.ShaderModule("1", [200, 200, 0], {
    label: "ShaderModule",
    code: "",
  });
  manager.shaderModules.push(shaderModule);

  let vertexState = NodeFactory.VertexState("2", [0, 200, 1], {
    label: "VertexState",
    module: null,
    entryPoint: "vs",
  });
  manager.vertexStates.push(vertexState);

  let sender = shaderModule.sender;
  let receiverId = "40";

  expect(() => {
    createConnection(manager, sender, receiverId);
  }).toThrow(`Could not find receiverNode with uuid: ${receiverId}`);
});

it("throws an error while trying to form invalid NodeConnection", () => {
  let manager = new NodeManager();

  let shaderModule = NodeFactory.ShaderModule("1", [200, 200, 0], {
    label: "ShaderModule",
    code: "",
  });
  manager.shaderModules.push(shaderModule);

  let pipeline = NodeFactory.RenderPipeline("2", [0, 200, 1], {
    label: "Pipeline",
    layout: "auto",
    vertex: null,
    fragment: null,
    primitive: {
      topology: "triangle-strip",
    },
  });
  manager.renderPipelines.push(pipeline);

  let sender = shaderModule.sender;
  let receiverId = pipeline.uuid;

  expect(() => {
    createConnection(manager, sender, receiverId);
  }).toThrow(`Could not find reiever with type: ${sender.type}`);
});
