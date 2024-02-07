import { Libp2p } from "libp2p";

import { BaseNode, BaseNodeId, BaseNodeStatus, BaseNodeWorker, IBaseNode } from "../base/node.js";
import { IBaseNodeCommandActions } from "../base/commands.js";
import { BaseNodesManager } from "../base/manager.js";

class Libp2pNodeCommandActions implements IBaseNodeCommandActions {
    actions: string[] = [
        'dial',
        'dialProtocol',
        'hangUp',
        'closeConnection',
        'listConnections'
    ]
}

class Libp2pNode<T=Libp2p> extends BaseNode<T> {
    public constructor(
        id: BaseNodeId,
        worker: BaseNodeWorker<T>,
        status: BaseNodeStatus,
        commands: Libp2pNodeCommandActions
    ) {
        super(id, worker, status, commands);
    }
}

class Libp2pNodesManager<T=Libp2p> extends BaseNodesManager<T> {
    public constructor() {
        super()
    }
}

export {
    Libp2pNode,
    Libp2pNodeCommandActions,
    Libp2pNodesManager
}