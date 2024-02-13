import {
    Libp2p
} from 'libp2p';

import {
    BaseCommandProperties,
} from "./command.js";


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
        },
        {
            action: 'stop',
            call: worker.stop,
        },
        {
            action: 'getConnections',
            call: worker.getConnections,
        },
        {
            action: 'getPeerID',
            call: worker.peerId,
        },
        {
            action: 'dial',
            call: worker.dial,
            args: [
                'peerId'
            ],
        },
        {
            action: 'disconnect',
            call: worker.hangUp,
        },
        {
            action: 'getPeers',
            call: worker.getPeers,
        }
    ];
    return baseCommands;
}

export {
    libp2pCommands
}