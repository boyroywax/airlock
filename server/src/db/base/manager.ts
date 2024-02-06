import { BaseNodeCommandAction, BaseNodeCommandPlane } from "./commands.js";
import { IBaseNode, BaseNode, IBaseNodeId, IBaseNodeWorker, BaseNodeStatuses, BaseNodeStatus, BaseNodeId } from "./node.js";

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

interface IBaseNodeCreateOptions<T> {
    id: IBaseNodeId;
    type: NodeInstanceTypes;
    worker: IBaseNodeWorker<T>;
    commands?: BaseNodeCommandAction[];
    params?: string[];
}

class BaseNodeCreateOptions<T> implements IBaseNodeCreateOptions<T> {
    public id: IBaseNodeId;
    public type: NodeInstanceTypes;
    public worker: IBaseNodeWorker<T>;
    public commands: BaseNodeCommandAction[];
    public params: string[];

    public constructor(
        id: IBaseNodeId,
        type: NodeInstanceTypes,
        worker: IBaseNodeWorker<T>,
        commands: BaseNodeCommandAction[] = [],
        params: string[] = []
    ) {
        this.id = id;
        this.type = type;
        this.worker = worker;
        this.commands = commands;
        this.params = params;
    }
}

interface IBaseNodesManager<T, U> {
    nodes: Map<BaseNodeId, IBaseNode<T, U>>;

    create(options: IBaseNodeCreateOptions<T>): void;
    get(id: IBaseNodeId): IBaseNode<T, U>;
    list(): IBaseNodeId[];
    delete(id: IBaseNodeId): void;
}

class BaseNodesManager<T, U> implements IBaseNodesManager<T, U> {
    public nodes: Map<BaseNodeId, BaseNode<T, U>>;

    public constructor() {
        this.nodes = new Map();
    }

    public create(options: BaseNodeCreateOptions<T>): void {
        const node = new BaseNode<T, U>(
            options.id,
            options.worker,
            {
                status: BaseNodeStatuses.NEW,
                message: `${options.id}: New node created.`
            } as BaseNodeStatus,
            new BaseNodeCommandPlane<U>(options.commands)
        );
        this.nodes.set(options.id, node);
    }

    public get(id: IBaseNodeId): IBaseNode<T, U> {
        return this.nodes.get(id);
    }

    public list(): IBaseNodeId[] {
        return Array.from(this.nodes.keys());
    }

    public delete(id: IBaseNodeId): void {
        this.nodes.delete(id);
    }
}




    