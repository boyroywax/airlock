import {
    Libp2p,
    Libp2pOptions
} from 'libp2p';


import {
    BaseNodeId,
    BaseNodeResponse,
    BaseNodeCommandActions,
    BaseNodeResponseCode,
} from './base/index.js';

import {
    Libp2pNode,
    Libp2pNodeCommandActions,
    Libp2pNodeCreateOptions,
    Libp2pNodesManager
} from './libp2p.js';


const initDefaultLibp2pNode = (
    options?: Libp2pNodeCreateOptions<Libp2p, Libp2pOptions>
): Libp2pNodesManager => {
    const manager = new Libp2pNodesManager();

    if (options) {
        manager.create(options);
    }
    else {
        const options = new Libp2pNodeCreateOptions<Libp2p, Libp2pOptions>({
            id: 'abcd123',
        });
        manager.create(options);
    }

    return manager;
}

export {
    BaseNodeResponse,
    BaseNodeResponseCode,
    BaseNodeCommandActions,
    Libp2pNode,
    initDefaultLibp2pNode,
    Libp2pNodeCommandActions,
    Libp2pNodeCreateOptions,
    Libp2pNodesManager
}

