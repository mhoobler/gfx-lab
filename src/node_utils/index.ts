import NodeManager from "../components/NodeContext/NodeManager";
import {
  INodeReceiver,
  INodeSender,
  NodeConnection,
  NodeData,
  NodeType,
} from "../data";

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
  receiver: INodeReceiver<unknown>
): NodeConnection {
  const receiverXYZ: [n, n, n] = [...receiverNode.xyz];
  const i = receiverNode.receivers.findIndex((r) => r === receiver);
  receiverXYZ[0] += 8;
  receiverXYZ[1] += 30 + 30 * i;

  const senderXYZ: [n, n, n] = [...senderNode.xyz];
  senderXYZ[0] += senderNode.size[0];
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
  const connections: NodeConnection[] = [];

  for (const senderNode of getAllNodes(manager)) {
    const { sender } = senderNode;

    for (const receiverNode of sender.to) {
      const { receivers } = receiverNode;

      for (const receiver of receivers) {
        if (receiver.type === senderNode.type) {
          connections.push(
            getNodeConnection(senderNode, receiverNode, receiver)
          );
        }
      }
    }
  }

  return connections;
}

export function removeConnection(
  manager: NodeManager,
  receiverId: string,
  receiverType: NodeType
) {
  const nodes = getAllNodes(manager);

  const receiverNode = nodes.find((node) => node.uuid === receiverId);
  if (!receiverNode) {
    throw new Error(`Could not find receiverNode with uuid: ${receiverId}`);
  }
  if (!receiverNode) {
    throw new Error(`receiverNode does not have receivers: ${receiverNode}`);
  }

  const receiver = receiverNode.receivers.find(
    (rec) => rec.type === receiverType
  );
  if (!receiver) {
    throw new Error(`Could not find receiver with type: ${receiverType}`);
  }
  if (receiver.from === null) {
    return console.warn(
      "Dev tools reruns this function in reducer, which causes an error in dev builds. If connection gets deleted, it's probably fine."
    );
  }

  const senderNode = nodes.find((node) => node.uuid === receiver.from.uuid);
  if (!senderNode) {
    throw new Error(
      `Could not find senderNode with uuid: ${receiver.from.uuid}`
    );
  }
  const sender = senderNode.sender;

  sender.to.delete(receiverNode);
  receiver.from = null;
}

// Must check that sender is valid for receiver before this calling this function
export function createConnection(
  manager: NodeManager,
  sender: INodeSender<unknown, unknown>,
  receiverId: string
) {
  const nodes = getAllNodes(manager);

  const senderNode: NodeData<unknown> = nodes.find((node) => node.uuid === sender.uuid);
  if (!senderNode) {
    throw new Error(`Could not find senderNode with uuid: ${sender.uuid}`);
  }

  const receiverNode: NodeData<unknown> = nodes.find(
    (node) => node.uuid === receiverId
  );
  if (!receiverNode) {
    throw new Error(`Could not find receiverNode with uuid: ${receiverId}`);
  }

  const receiver =
    receiverNode && receiverNode.receivers.find((rec) => rec.type === sender.type);
  if (!receiver) {
    throw new Error(`Could not find receiver with type: ${sender.type}`);
  }

  receiver.from = senderNode;
  sender.to.add(receiverNode);

  switch (senderNode.type) {
    case "ShaderModule": {
      receiverNode.body.module = manager.device.createShaderModule(
        senderNode.body
      );
      break;
    }
    case "VertexState": {
      receiverNode.body.vertex = senderNode.body;
      break;
    }
    case "FragmentState": {
      receiverNode.body.fragment = senderNode.body;
      break;
    }
    case "RenderPipeline": {
      receiverNode.body.renderPipeline = manager.device.createRenderPipeline(
        senderNode.body
      );
      break;
    }
    case "CanvasPanel": {
      const createView = () =>
        senderNode.body.ctx.getCurrentTexture().createView();
      receiverNode.body.createView = createView;
      break;
    }
    case "RenderPass": {
      receiverNode.body.renderPassDesc = senderNode.body;
      break;
    }
    case "DrawCall": {
      break;
    }
    default: {
      throw new Error(
        "Fallthrough case, connection not created: " + senderNode.type
      );
    }
  }
}
