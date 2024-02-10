import { Helia } from 'helia';
import { Libp2pOptions } from 'libp2p';
import { Libp2p, ServiceMap } from '@libp2p/interface';
import { OrbitDB, Database } from '@orbitdb/core';

import { IHeliaNodeOptions } from './helia.js';
import { IOrbitDBNodeOptions, IOrbitDBOptions } from './orbitdb.js';

import {
    // IPFSNode,
    Libp2pNode,
    // OrbitDBNode
} from '../db/index.js';
import { NodeStatus } from './constants.js';

/**
 * @interface INodeConfig
 * @description The configuration for a node instance
 * @summary The configuration for a node instance
 * @property {string} id - The System Worker ID of the node
 * @property {WorkerOptions} [options] - The options for the node instance
 * @property {WorkerType} [instance] - The instance of the node
 */
interface INodeConfig {
    id: string;
    options?: Libp2pOptions | IHeliaNodeOptions | IOrbitDBNodeOptions | IOrbitDBOptions;
    instance?: Helia | Libp2p<ServiceMap> | typeof OrbitDB | typeof Database;
}

/**
 * @interface INode
 * @description The base class for all node instances (IPFS, OrbitDB, Libp2p, etc.)
 * @summary The base class for all node instances
 * @property {string} id - The System Worker ID of the node
 * @property {Helia | Libp2p<ServiceMap> | typeof OrbitDB | typeof Database} [instance] - The instance of the node
 * @method getInstance - Returns the instance of the node
 * @method getPeerID - Returns the Peer ID of the node
 * @method getStatus - Returns the status of the node
 * @method getWorkerID - Returns the System Worker ID of the node
 * @method start - Starts the node
 * @method stop - Stops the node
 * @method command - Sends a command to the node
 */
interface INode {
    id: string;
    status: NodeStatus;
    worker: 

    getInstance(): INode['commands'][''];
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
    // nodeWorker: INode | IPFSNode | OrbitDBNode | Libp2pNode;
    nodeWorker: INode | Libp2pNode;

    execute: (command: INodeCommand | any) => Promise<INodeCommandResponse>
}

interface IOpenDBCommandPlane {
    db: typeof Database;

    execute: (command: INodeCommand) => Promise<INodeCommandResponse>
}

/**
 * @interface INodeCommand
 * @description The command to send to a node instance
 * @summary The command to send to a node instance
 * @property {Libp2pCommands | OrbitDBNodeCommands | OpenDBCommands} command - The command to send
 * @property {IOrbitDBOptions | any} args - The arguments for the command
 */
interface INodeCommand {
    // command: string | Libp2pCommands | OrbitDBNodeCommands | OpenDBCommands | any;
    command: string | any;
    args: IOrbitDBOptions | string[];
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
