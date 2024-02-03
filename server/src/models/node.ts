import { Helia } from 'helia';
import { Libp2p, ServiceMap } from '@libp2p/interface';
import { OrbitDB, Database } from '@orbitdb/core';


/*
    Node Instances are the base class for all node instances (IPFS, OrbitDB, Libp2p, etc.)
*/
interface INodeConfig {
    id?: string | undefined;
    options?: any;
    instance?: Helia | Libp2p<ServiceMap> | typeof OrbitDB | typeof Database | undefined;
}

interface INode {
    id: string;
    instance:  Helia | Libp2p<ServiceMap> | typeof OrbitDB | typeof Database;

    getID(): INode['id'];
    getInstance(): INode['instance'];
    getStatus(): INodeActionResponse;
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
