import { Helia } from 'helia';
import { Libp2pOptions } from 'libp2p';
import { Libp2p, ServiceMap } from '@libp2p/interface';
import { OrbitDB, Database } from '@orbitdb/core';

import { IHeliaNodeOptions } from './helia.js';
import { IOrbitDBNodeOptions, IOrbitDBOptions } from './orbitdb.js';
import { OrbitDBNodeCommand, OrbitDBNodeCommands } from '../db/orbitdb/commands.js';
import { Libp2pCommands, Libp2pNodeCommand } from '../db/libp2p/commands.js';
import { IPFSNode, Libp2pNode, OrbitDBNode } from '../db/index.js';
import { OpenDBCommands } from '../db/open/commands.js';

/**
 * @constant NodeInstanceTypes
 * @description The types of node instances
 * @summary The types of node instances
 * @readonly
 * @enum {string}
 * @property {string} DB - The node instance is a database
 * @property {string} LIBP2P - The node instance is a libp2p node
 * @property {string} IPFS - The node instance is an IPFS node
 * @property {string} ORBITDB - The node instance is an OrbitDB node
 */ 
enum NodeInstanceTypes {
    OPEN_DB = 'db',
    LIBP2P = 'libp2p',
    IPFS = 'ipfs',
    ORBITDB = 'orbitdb'
}

/**
 * @constant NodeInstanceStatus
 * @description The status of node instances
 * @summary The status of node instances
 * @enum {string}
 * @readonly
 * @property {string} STARTED - The node instance is started
 * @property {string} STOPPED - The node instance is stopped
 * @property {string} ERROR - The node instance has an error
 */
enum NodeInstanceStatus {
    STARTED = 'started',
    STOPPED = 'stopped',
    ERROR = 'error'
}

/**
 * @constant NodeCodes
 * @description The response codes for node instances
 * @summary The response codes for node instances
 * @enum {number}
 * @readonly
 * @property {number} LIBP2P - The response code for libp2p nodes
 * @property {number} IPFS - The response code for IPFS nodes
 * @property {number} ORBITDB - The response code for OrbitDB nodes
 * @property {number} OPEN_DB - The response code for open databases
 */
enum NodeCodes {
    LIBP2P = 100,
    IPFS = 200,
    ORBITDB = 300,
    OPEN_DB = 400
}   

/**
 * @interface INodeConfig
 * @description The configuration for a node instance
 * @summary The configuration for a node instance
 * @property {string} id - The System Worker ID of the node
 * @property {Libp2pOptions | IHeliaNodeOptions | IOrbitDBNodeOptions | IOrbitDBOptions} [options] - The options for the node instance
 * @property {Helia | Libp2p<ServiceMap> | typeof OrbitDB | typeof Database} [instance] - The instance of the node
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
    nodeWorker: INode | IPFSNode | OrbitDBNode | Libp2pNode;

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
    command: string | Libp2pCommands | OrbitDBNodeCommands | OpenDBCommands | any;
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
