import { Helia } from 'helia';
import { Libp2pOptions } from 'libp2p';
import { Libp2p, ServiceMap } from '@libp2p/interface';
import { OrbitDB, Database } from '@orbitdb/core';

import { IHeliaNodeOptions } from './helia.js';
import { IOrbitDBNodeOptions } from './orbitdb.js';


/*
    Node Instances are the base class for all node instances (IPFS, OrbitDB, Libp2p, etc.)
*/
interface INodeConfig {
    id: string;
    options?: Libp2pOptions | IHeliaNodeOptions | IOrbitDBNodeOptions;
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

export {
    INode,
    INodeActionResponse,
    INodeConfig
}
