/*
    Node Instances are the base class for all node instances (IPFS, OrbitDB, Libp2p, etc.)
*/
interface INodeConfig {
    id?: string | undefined;
    options?: any;
    instance?: any;
}

interface INode {
    id: string;
    instance: any;

    getID(): INode['id'];
    getInstance(): INode['instance'];
    getStatus(): Promise<INodeActionResponse>;
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

interface INodesManagerConfig {
    instances?: Map<string, INode>;
    options?: INodeConfig[];
}

interface INodesManager {
    instances: Map<string, INode>;

    create(config: INodeConfig): INodeActionResponse;  // creates a new instance and adds it to the instances map
    add(instance: INode): INodeActionResponse;  // adds an existing instance to the instances map
    get(id: INode['id']): INode;  // returns an instance by id
    list(): INode[];  // returns an array of all instances
    delete(id: INode['id']): INodeActionResponse;  // deletes an instance by id
}

export {
    INode,
    INodeActionResponse,
    INodeConfig,
    INodesManager,
    INodesManagerConfig
}
