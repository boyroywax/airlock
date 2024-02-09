import {
    Libp2p
} from 'libp2p';

import {
    BaseCommandProperties,
} from "./commands.js";


const libp2pCommands = ({
    worker,
    commands
} : {
    worker: Libp2p,
    commands?: BaseCommandProperties[],
}): BaseCommandProperties[] => {
    
    const baseCommands = commands ? commands : [
        {
            action: 'start',
            call: worker.start,
            args: [],
            kwargs: {}
        },
        {
            action: 'stop',
            call: worker.stop,
            args: [],
            kwargs: {}
        },
        {
            action: 'getConnections',
            call: worker.getConnections,
            args: [],
            kwargs: {}
        },
        {
            action: 'getPeerID',
            call: worker.peerId,
            args: [],
            kwargs: {}
        },
        {
            action: 'dial',
            call: worker.dial,
            args: [],
            kwargs: {}
        },
        {
            action: 'disconnect',
            call: worker.hangUp,
            args: [],
            kwargs: {}
        },
        {
            action: 'getPeers',
            call: worker.getPeers,
            args: [],
            kwargs: {}
        }
    ];
    return baseCommands;
}

export {
    libp2pCommands
}