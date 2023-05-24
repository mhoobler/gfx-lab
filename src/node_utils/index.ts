import NodeManager from "../components/NodeContext/NodeManager";
import {
  GPUType,
  INodeReceiver,
  INodeSender,
  NodeConnection,
  NodeData,
} from "../data";

export function getAllNodes(manager: NodeManager) {
  let arr = [
    ...manager.canvasPanels,
    ...manager.shaderModules,
    ...manager.renderPipelines,
    ...manager.vertexStates,
    ...manager.fragmentStates,
  ].sort((a, b) => a.xyz[2] - b.xyz[2]);

  arr.forEach((n: NodeData<any>, i: number) => {
    n.xyz[2] = i;
  });
  return arr;
}

function getNodeConnection(
  senderNode: NodeData<any>,
  receiverNode: NodeData<any>,
  receiver: INodeReceiver<any>
): NodeConnection {
  let receiverXYZ: [n, n, n] = [...receiverNode.xyz];
  let i = receiverNode.receivers.findIndex((r) => r === receiver);
  receiverXYZ[0] += 10;
  receiverXYZ[1] += 40 + 40 * i;

  let senderXYZ: [n, n, n] = [...senderNode.xyz];
  senderXYZ[0] += senderNode.size[0] - 10;
  senderXYZ[1] += 30;

  return {
    sender: {
      uuid: senderNode.uuid,
      xyz: senderXYZ,
    },
    receiver: {
      type: receiverNode.receivers[i].type,
      uuid: receiverNode.uuid,
      xyz: receiverXYZ,
    },
  };
}

export function getAllConnections(manager: NodeManager): NodeConnection[] {
  let connections: NodeConnection[] = [];

  for (let senderNode of getAllNodes(manager)) {
    let { sender } = senderNode;

    for (let receiverNode of sender.to) {
      let { receivers } = receiverNode;

      for (let receiver of receivers) {
        connections.push(getNodeConnection(senderNode, receiverNode, receiver));
      }
    }
  }

  return connections;
}

export function removeConnection(
  manager: NodeManager,
  receiverId: string,
  receiverType: GPUType
) {
  let nodes = getAllNodes(manager);

  let receiverNode = nodes.find((node) => node.uuid === receiverId);
  if (!receiverNode) {
    throw new Error(`Could not find receiverNode with uuid: ${receiverId}`);
  }
  if (!receiverNode) {
    throw new Error(`receiverNode does not have receivers: ${receiverNode}`);
  }

  let receiver = receiverNode.receivers.find(
    (rec) => rec.type === receiverType
  );
  if (!receiver) {
    throw new Error(`Could not find reiever with type: ${receiverType}`);
  }
  if (receiver.from === null) {
    return console.warn(
      "Dev tools reruns this function in reducer, which causes an error in dev builds. If connection gets deleted, it's probably fine."
    );
  }

  let senderNode = nodes.find((node) => node.uuid === receiver.from.uuid);
  if (!senderNode) {
    throw new Error(
      `Could not find senderNode with uuid: ${receiver.from.uuid}`
    );
  }
  let sender = senderNode.sender;

  sender.to.delete(receiverNode);
  receiver.from = null;
}

// Must check that sender is valid for receiver before this calling this function
export function createConnection(
  manager: NodeManager,
  s: INodeSender<any>,
  receiverId: string
) {
  let nodes = getAllNodes(manager);

  let senderNode = nodes.find((node) => node.uuid === s.uuid);
  if (!senderNode) {
    throw new Error(`Could not find senderNode with uuid: ${s.uuid}`);
  }

  let receiverNode = nodes.find((node) => node.uuid === receiverId);
  if (!receiverNode) {
    throw new Error(`Could not find receiverNode with uuid: ${receiverId}`);
  }

  let r =
    receiverNode && receiverNode.receivers.find((rec) => rec.type === s.type);
  if (!r) {
    throw new Error(`Could not find reiever with type: ${s.type}`);
  }

  r.from = senderNode;
  s.to.add(receiverNode);
}

function applyConnection(device:GPUDevice, senderNode: NodeData<any>, receiverNode: NodeData<any>) {
  switch(senderNode.type) {
    case "ShaderModule": {
      receiverNode.body.module = device.createShaderModule(senderNode.body);
    }
    case "VertexState": {
      receiverNode.body.vertex = senderNode.body
    }
    case "FragmentState": {
      receiverNode.body.fragment = senderNode.body
    }
    case "RenderPipeline": {

    }
    case "CanvasPanel": {
      let createView = senderNode.body.ctx.getCurrentTexture().createView;
      receiverNode.body.createView = createView;
    }

  }

}
