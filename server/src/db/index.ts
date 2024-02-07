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
    const commands = new Libp2pNodeCommandActions();
    manager.create(options);

    console.log(`[initDefaultLibp2pNode] manager: ${manager.get(new BaseNodeId('abcd123')).commands.execute(new BaseNodeCommandOptions('listConnections'))}`)
    return manager;
}

export {
    initDefaultLibp2pNode
}

