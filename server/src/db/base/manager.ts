import {
    IBaseNodeCommandActions,
    BaseNodeCommandActions
} from "./commands.js";
import {
    IBaseNode,
    BaseNode,
    IBaseNodeId,
    IBaseNodeWorker,
    BaseNodeStatuses,
    BaseNodeStatus,
    BaseNodeId,
    BaseNodeWorker
} from "./node.js";

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

interface IBaseNodeType<T> {
    type?: T | NodeInstanceTypes;
}

class BaseNodeInstanceType<T>
    implements IBaseNodeType<T>
{
    public type?: T | NodeInstanceTypes;

    public constructor(type?: T | NodeInstanceTypes) {
        this.type = type;
    }
}

interface IBaseNodeCreateOptions<T, U> {
    id: IBaseNodeId;
    type: IBaseNodeType<T>;
    worker: IBaseNodeWorker<T, U>;
    commands: IBaseNodeCommandActions;
    params: string[];
}

class BaseNodeCreateOptions<T, U>
    implements IBaseNodeCreateOptions<T, U>
{
    public id: BaseNodeId;
    public type: BaseNodeInstanceType<T>;
    public worker: BaseNodeWorker<T, U>;
    public commands: BaseNodeCommandActions;
    public params: string[];

    public constructor(
        id: IBaseNodeId,
        type?: BaseNodeInstanceType<T>,
        worker?: BaseNodeWorker<T, U>,
        commands?: BaseNodeCommandActions,
        params?: string[]
    ) {
        this.id = id;
        this.type = type ? type: new BaseNodeInstanceType<T>();
        this.worker = worker ? worker : new BaseNodeWorker<T, U>();
        this.commands = commands ? commands : new BaseNodeCommandActions();
        this.params = params ? params : [];
    }
}

interface IBaseNodeManagerOptions<T, U> {
    collection: IBaseNodeCreateOptions<T, U>[];

    add(options: IBaseNodeCreateOptions<T, U>): void;
    remove(id: IBaseNodeId): void;
    list(): IBaseNodeCreateOptions<T, U>[];
}

class BaseNodeManagerOptions<T, U>
    implements IBaseNodeManagerOptions<T, U>
{
    public collection: BaseNodeCreateOptions<T, U>[];

    public constructor(options?: BaseNodeCreateOptions<T, U>[]) {
        this.collection = options ? options : [];
    }

    public add(options: BaseNodeCreateOptions<T, U>): void {
        this.collection.push(options);
    }

    public remove(id: IBaseNodeId): void {
        this.collection = this.collection.filter((option) => option.id !== id);
    }

    public list(): BaseNodeCreateOptions<T, U>[] {
        return this.collection;
    }
}


interface IBaseNodesManager<T, U> {
    nodes: Map<BaseNodeId, IBaseNode<T, U>>;
    options: IBaseNodeManagerOptions<T, U>;

    create(options: IBaseNodeCreateOptions<T, U>): void;
    get(id: IBaseNodeId): IBaseNode<T, U>;
    list(): IBaseNodeId[];
    delete(id: IBaseNodeId): void;
}


/**
 * @class BaseNodesManager
 * @description The manager for base nodes
 * @summary The manager for base nodes
 * @implements IBaseNodesManager
 * @template T - The type of the worker
 * @template U - The options type for the worker
 * 
 */
class BaseNodesManager<T, U>
    implements IBaseNodesManager<T, U>
{
    public nodes: Map<BaseNodeId, BaseNode<T, U>>;
    public options: BaseNodeManagerOptions<T, U>;

    public constructor({
        nodes,
        options
    }: {
        nodes?: Map<BaseNodeId, BaseNode<T, U>>,
        options?: BaseNodeManagerOptions<T, U>
    }) {
        this.nodes = nodes ? nodes : new Map<BaseNodeId, BaseNode<T, U>>();
        this.options = new BaseNodeManagerOptions<T, U>(options ? options.collection : []);
    }

    public create(options: BaseNodeCreateOptions<T, U>): void {
        this.options.add(options);

        const node = new BaseNode<T, U>(
            options.id,
            options.worker,
            {
                status: BaseNodeStatuses.NEW,
                message: `${options.id}: New node created.`
            } as BaseNodeStatus,
            options.commands,
        );
        this.nodes.set(node.id, node);
    }

    public get(id: BaseNodeId): BaseNode<T, U> {
        const activeNode: BaseNode<T, U> | undefined = this.nodes.get(id);

        if (activeNode) {
            return activeNode;
        }
        else {
            throw new Error(`${id}: Node not found.`);
        }
    }

    public list(): BaseNodeId[] {
        return Array.from(this.nodes.keys());
    }

    public delete(id: BaseNodeId): void {
        this.nodes.delete(id);
    }
}


export {
    BaseNodesManager,
    IBaseNodesManager,
    BaseNodeCreateOptions,
    IBaseNodeCreateOptions,
    NodeInstanceTypes,
    IBaseNodeManagerOptions,
    BaseNodeManagerOptions,
}


    