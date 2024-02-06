import { Helia } from 'helia';
import { Libp2pOptions } from 'libp2p';
import { Libp2p, ServiceMap } from '@libp2p/interface';
import { OrbitDB, Database } from '@orbitdb/core';

import { IHeliaNodeOptions } from './helia.js';
import { IOrbitDBNodeOptions, IOrbitDBOptions } from './orbitdb.js';
import { OrbitDBNodeCommands } from '../db/orbitdb/commands.js';
import { Libp2pCommands, Libp2pNodeCommand } from '../db/libp2p/commands.js';
import { Libp2pNode } from '../db/index.js';
import { OpenDBCommands } from '../db/open/commands.js';

enum NodeInstanceTypes {
    LIBP2P = 'libp2p',
    IPFS = 'ipfs',
    ORBITDB = 'orbitdb'
}

enum NodeInstanceStatus {
    STARTED = 'started',
    STOPPED = 'stopped',
    ERROR = 'error'
}

enum NodeCodes {
    LIBP2P = 100,
    IPFS = 200,
    ORBITDB = 300,
    OPEN_DB = 400
}   


/*
    Node Instances are the base class for all node instances (IPFS, OrbitDB, Libp2p, etc.)
*/
interface INodeConfig {
    id: string;
    options?: Libp2pOptions | IHeliaNodeOptions | IOrbitDBNodeOptions | IOrbitDBOptions;
    instance?: Helia | Libp2p<ServiceMap> | typeof OrbitDB | typeof Database;
}

interface INode {
    id: string;
    instance?:  Helia | Libp2p<ServiceMap> | typeof OrbitDB | typeof Database;

    getInstance(): INode['instance'];
    getPeerID(): string;
    getStatus(): INodeActionResponse;
    getWorkerID(): INode['id'];
    start(): Promise<INodeActionResponse>;
    stop(): Promise<INodeActionResponse>;
    command?(command: INodeCommand): Promise<INodeCommandResponse>;

}

/*
    Action Response Codes:
    100: Libp2p Response
    200: IPFS Response
    300: OrbitDB Response
    400: Open Database Response
*/

interface INodeActionResponse {
    code: number;
    message: string;
    error?: Error;
}

interface INodeCommandPlane {
    nodeWorker: INode | Libp2pNode;

    execute: (command: INodeCommand | Libp2pNodeCommand) => Promise<INodeCommandResponse>
}

interface IOpenDBCommandPlane {
    db: typeof Database;

    execute: (command: INodeCommand) => Promise<INodeCommandResponse>
}

interface INodeCommand {
    command: string | Libp2pCommands | OrbitDBNodeCommands | OpenDBCommands;
    args?: string[];
}


interface INodeCommandResponse {
    code: number;
    message: string | INodeActionResponse;
    output?: any;
    error?: Error;
}

export {
    INode,
    INodeActionResponse,
    INodeConfig,
    INodeCommandPlane,
    INodeCommand,
    INodeCommandResponse,
    IOpenDBCommandPlane
}
