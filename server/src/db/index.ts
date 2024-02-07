import { Libp2p, Libp2pOptions } from 'libp2p';

import {
    BaseNodeCommandOptions,
    BaseNodeCreateOptions,
    BaseNodeId,
} from './base/index.js';

import {
    Libp2pNodeCommandActions,
    Libp2pNodesManager
} from './libp2p.js';

const initDefaultLibp2pNode = (
    options?: BaseNodeCreateOptions<Libp2p, Libp2pOptions>
) => {
    const manager = new Libp2pNodesManager();
    manager.create(options);

    const connections = manager.get(
        new BaseNodeId('abcd123'))
        .commands
        .execute(new BaseNodeCommandOptions('listConnections')
    )

    console.log(`[initDefaultLibp2pNode] manager: ${connections}`)
    return manager;
}

export {
    initDefaultLibp2pNode,
    Libp2pNodeCommandActions
}

