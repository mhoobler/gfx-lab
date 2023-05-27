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
  const receiverIndex = vertexState.receivers.findIndex((rec) => rec.type === shaderModule.type);

  createConnection(manager, sender, receiverId, receiverIndex);
  expect(sender.to.size).toBe(1);
  expect(receiver.from).not.toBeFalsy();

  removeConnection(manager, { senderId: "1", receiverId: "2" });
  expect(sender.to.size).toBe(0);
  expect(receiver.from).toBeFalsy();

  let innerMap = manager.connections.get(shaderModule);
  expect(innerMap).not.toBeFalsy();
});

it("throws an error with Invalid SenderId", () => {
  const manager = new NodeManager(null, null);

  const shaderModule = NodeFactory.ShaderModule("1", [600, 200, 0]);
  addNode(manager, shaderModule);

  const vertexState = NodeFactory.VertexState("2", [400, 0, 1])
  addNode(manager, vertexState);

  const sender = shaderModule.sender;
  sender.uuid = "40";
  const receiverId = vertexState.uuid;
  const receiverIndex = vertexState.receivers.findIndex((rec) => rec.type === shaderModule.type);

  expect(() => {
    createConnection(manager, sender, receiverId, receiverIndex);
  }).toThrow(`Could not find senderNode with uuid: ${sender.uuid}`);
});

it("throws with Invalid ReceiverId", () => {
  const manager = new NodeManager(null, null);

  const shaderModule = NodeFactory.ShaderModule("1", [600, 200, 0]);
  addNode(manager, shaderModule);

  const vertexState = NodeFactory.VertexState("2", [400, 0, 1])
  addNode(manager, vertexState);

  const sender = shaderModule.sender;
  const receiverId = "40";
  const receiverIndex = vertexState.receivers.findIndex((rec) => rec.type === shaderModule.type);

  expect(() => {
    createConnection(manager, sender, receiverId, receiverIndex);
  }).toThrow(`Could not find receiverNode with uuid: ${receiverId}`);
});

it("throws with Invalid Sender Type", () => {
  const manager = new NodeManager(null, null);

  const shaderModule = NodeFactory.ShaderModule("1", [600, 200, 0]);
  addNode(manager, shaderModule);

  const pipeline = NodeFactory.RenderPipeline("2", [600, 0, 1]);
  addNode(manager, pipeline);

  const sender = shaderModule.sender;
  const senderNode = shaderModule;
  const receiverId = pipeline.uuid;
  const receiverIndex = 0;
  const receiver = pipeline.receivers[receiverIndex];

  expect(() => {
    createConnection(manager, sender, receiverId, receiverIndex);
  }).toThrow(`Receiver with index: ${receiverIndex} requires type: ${receiver.type} but was sent type: ${senderNode.type}`);
});
