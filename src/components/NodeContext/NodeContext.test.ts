import { createConnection, removeConnection } from "../../node_utils";
import { NodeFactory } from "../../data";
import NodeManager, {addNode} from "./NodeManager";

const device = {
  // eslint-disable-next-line
  createShaderModule: () => {},
} as unknown as GPUDevice;

it("creates and deletes a NodeConnection", () => {
  const manager = new NodeManager(device, null);

  const shaderModule = NodeFactory.ShaderModule("1", [600, 200, 0]);
  addNode(manager, shaderModule);

  const vertexState = NodeFactory.VertexState("2", [400, 0, 1])
  addNode(manager, vertexState);

  const sender = shaderModule.sender;
  const receiver = vertexState.receivers[0];
  const receiverId = vertexState.uuid;

  createConnection(manager, sender, receiverId);
  expect(sender.to.size).toBe(1);
  expect(receiver.from).not.toBeFalsy();

  removeConnection(manager, "2", "ShaderModule");
  expect(sender.to.size).toBe(0);
  expect(receiver.from).toBeFalsy();
});

it("throws an error while trying to form invalid NodeConnection", () => {
  const manager = new NodeManager(null, null);

  const shaderModule = NodeFactory.ShaderModule("1", [600, 200, 0]);
  addNode(manager, shaderModule);

  const vertexState = NodeFactory.VertexState("2", [400, 0, 1])
  addNode(manager, vertexState);

  const sender = shaderModule.sender;
  sender.uuid = "40";
  const receiverId = vertexState.uuid;

  expect(() => {
    createConnection(manager, sender, receiverId);
  }).toThrow(`Could not find senderNode with uuid: ${sender.uuid}`);
});

it("throws an error while trying to form invalid NodeConnection", () => {
  const manager = new NodeManager(null, null);

  const shaderModule = NodeFactory.ShaderModule("1", [600, 200, 0]);
  addNode(manager, shaderModule);

  const vertexState = NodeFactory.VertexState("2", [400, 0, 1])
  addNode(manager, vertexState);

  const sender = shaderModule.sender;
  const receiverId = "40";

  expect(() => {
    createConnection(manager, sender, receiverId);
  }).toThrow(`Could not find receiverNode with uuid: ${receiverId}`);
});

it("throws an error while trying to form invalid NodeConnection", () => {
  const manager = new NodeManager(null, null);

  const shaderModule = NodeFactory.ShaderModule("1", [600, 200, 0]);
  addNode(manager, shaderModule);

  const pipeline = NodeFactory.RenderPipeline("2", [600, 0, 1]);
  addNode(manager, pipeline);

  const sender = shaderModule.sender;
  const receiverId = pipeline.uuid;

  expect(() => {
    createConnection(manager, sender, receiverId);
  }).toThrow(`Could not find receiver with type: ${sender.type}`);
});
