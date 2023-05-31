import NodeManager from "components/NodeContext/NodeManager";
export function getAllNodes(manager: NodeManager) {
  const arr = [...Object.values(manager.nodes)].sort(
    (a, b) => a.xyz[2] - b.xyz[2]
  );

  arr.forEach((n: NodeData<unknown>, i: number) => {
    n.xyz[2] = i;
  });
  return arr;
}

function getNodeConnection(
  senderNode: NodeData<unknown>,
  receiverNode: NodeData<unknown>,
  receiverIndex: number
): NodeConnection {
  const receiverXYZ: [n, n, n] = [...receiverNode.xyz];
  receiverXYZ[0] += 8;
  receiverXYZ[1] += 30 + 30 * receiverIndex;

  const senderXYZ: [n, n, n] = [...senderNode.xyz];
  senderXYZ[0] += senderNode.size[0];
  senderXYZ[1] += 30;

  return {
    sender: {
      uuid: senderNode.uuid,
      xyz: senderXYZ,
    },
    receiver: {
      type: receiverNode.receivers[receiverIndex].type,
      uuid: receiverNode.uuid,
      xyz: receiverXYZ,
    },
  };
}

export function getAllConnections2(manager: NodeManager): NodeConnection[] {
  const connections = [];

  for (const [senderNode, innerMap] of manager.connections.entries()) {
    for (const [receiverNode, receiverIndex] of innerMap.entries()) {
      connections.push(
        getNodeConnection(senderNode, receiverNode, receiverIndex)
      );
    }
  }

  return connections;
}

export function removeConnection(
  manager: NodeManager,
  ids: {
    receiverId: string;
    senderId: string;
  }
) {
  const { senderId, receiverId } = ids;
  const senderNode = manager.nodes[senderId];
  if (!senderNode) {
    throw new Error(`Could not find senderNode with uuid: ${receiverId}`);
  }

  const receiverNode = manager.nodes[receiverId];
  if (!receiverNode) {
    throw new Error(`Could not find receiverNode with uuid: ${receiverId}`);
  }

  const innerMap = manager.connections.get(senderNode);
  const receiverIndex = innerMap.get(receiverNode);
  if (receiverIndex >= 0) {
    receiverNode.receivers[receiverIndex].from = null;
    senderNode.sender.to.delete(receiverNode);
    innerMap.delete(receiverNode);
    finalizeConnection(manager, senderNode, receiverNode, true);
  }
}

// Must check that sender is valid for receiver before this calling this function
export function createConnection(
  manager: NodeManager,
  sender: NodeSender,
  receiverId: string,
  receiverIndex: number
) {
  const senderNode = manager.nodes[sender.uuid];
  if (!senderNode) {
    throw new Error(`Could not find senderNode with uuid: ${sender.uuid}`);
  }

  const receiverNode = manager.nodes[receiverId];
  if (!receiverNode) {
    throw new Error(`Could not find receiverNode with uuid: ${receiverId}`);
  }

  const receiver = receiverNode && receiverNode.receivers[receiverIndex];
  if (!receiver) {
    throw new Error(`Could not find receiver with index: ${receiverIndex}`);
  }
  if (receiver.type !== senderNode.type) {
    throw new Error(
                                                                                                                      `Receiver with index: ${receiverIndex} requires type: ${receiver.type} but was sent type: ${senderNode.type} \n(HINT: check payload.receiverIndex)`
    );
  }

  const innerMap = manager.connections.get(senderNode);

  if (innerMap) {
    innerMap.set(receiverNode, receiverIndex);
  } else {
    const newInnerMap: Map<NodeData<GPUBase>, number> = new Map();
    newInnerMap.set(receiverNode, receiverIndex);
    manager.connections.set(senderNode, newInnerMap);
  }

  receiver.from = senderNode;
  sender.to.add(receiverNode);
  finalizeConnection(manager, senderNode, receiverNode);
}

function finalizeConnection(
  manager: NodeManager,
  senderNode: NodeData<any>, // eslint-disable-line
  receiverNode: NodeData<any>, // eslint-disable-line
  isDelete = false
) {
  switch (senderNode.type) {
    case "ShaderModule": {
      receiverNode.body.module = isDelete
        ? null
        : manager.device.createShaderModule(senderNode.body);
      break;
    }
    case "VertexState": {
      receiverNode.body.vertex = isDelete ? null : senderNode.body;
      break;
    }
    case "FragmentState": {
      receiverNode.body.fragment = isDelete ? null : senderNode.body;
      break;
    }
    case "RenderPipeline": {
      receiverNode.body.renderPipeline = isDelete
        ? null
        : manager.device.createRenderPipeline(senderNode.body);
      break;
    }
    case "CanvasPanel": {
      senderNode.body.ctx.configure({
        device: manager.device,
        format: manager.format,
      });
      const createView = isDelete
        ? null
        : () => senderNode.body.ctx.getCurrentTexture().createView();
      receiverNode.body.createView = createView;
      break;
    }
    case "RenderPass": {
      receiverNode.body.renderPassDesc = isDelete ? null : senderNode.body;
      break;
    }
    case "DrawCall": {
      break;
    }
    case "Buffer": {
      receiverNode.body.buffer = isDelete ? null : senderNode.body.buffer;
      break;
    }
    case "Data": {
      receiverNode.body.size = senderNode.body.data.byteLength;
      receiverNode.body.buffer = manager.device.createBuffer(receiverNode.body);
      manager.device.queue.writeBuffer(receiverNode.body.buffer, 0, senderNode.body.data);
      break;
    }
    default: {
      throw new Error(
        "Fallthrough case, connection not created: " + senderNode.type
      );
    }
  }
}

export function updateConnections(manager: NodeManager, node: NodeData<any>) {
  for(let sendTo of node.sender.to) {
    let receiverNode = manager.nodes[sendTo.uuid];
    finalizeConnection(manager, node, receiverNode);
    updateConnections(manager, receiverNode);
  }
}
