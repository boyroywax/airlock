import {
    IBaseNodeCommandActions,
    BaseNodeCommandActions,
    BaseNodeCommandPlane,
    BaseNodeCommand,
    IBaseNodeCommand,
    IBaseNodeCommandPlane
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

import {
    createRandomId
} from "../../utils/index.js";

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
    ORBITDB = 'orbitdb',
    UNDEFINED = 'undefined'
}

interface IBaseNodeType {
    type: NodeInstanceTypes;
}

class BaseNodeType
    implements IBaseNodeType
{
    public type: NodeInstanceTypes;

    public constructor(type?: NodeInstanceTypes | string) {
        if (typeof type === 'string') {
            this.type = NodeInstanceTypes[type as keyof typeof NodeInstanceTypes];
        }
        else {
            this.type = NodeInstanceTypes.UNDEFINED;
        }
    }
}

interface IBaseNodeCreateOptions<T, U> {
    id: IBaseNodeId;
    type: IBaseNodeType;
    worker: IBaseNodeWorker<T, U>;
    commands: IBaseNodeCommandActions | IBaseNodeCommand[] | IBaseNodeCommandPlane<T, U>;
    params: string[] | any[];
}

class BaseNodeCreateOptions<T, U>
    implements IBaseNodeCreateOptions<T, U>
{
    public id: BaseNodeId;
    public type: BaseNodeType;
    public worker: BaseNodeWorker<T, U>;
    public commands: BaseNodeCommandPlane<T, U>;
    public params: string[] | any[];

    public constructor(
        id?: IBaseNodeId,
        type?: BaseNodeType,
        worker?: BaseNodeWorker<T, U>,
        commands?: BaseNodeCommandActions | BaseNodeCommand[] | BaseNodeCommandPlane<T, U>,
        params?: string[]
    ) {
        this.id = id ? id : new BaseNodeId(createRandomId());
        this.type = type ? type: new BaseNodeType();
        this.worker = worker ? worker : new BaseNodeWorker<T, U>();
        
        if (commands instanceof BaseNodeCommandPlane) {
            this.commands = commands;
        }
        else if (commands instanceof BaseNodeCommandActions) {
            this.commands = new BaseNodeCommandPlane<T, U>(this.worker, commands);
        }
        else {
            this.commands = new BaseNodeCommandPlane<T, U>(this.worker);
        }
        this.params = params ? params : [];
    }
}

interface IBaseNodeManagerOptions<T, U> {
    collection: Map<IBaseNodeId['id'], IBaseNodeCreateOptions<T, U>>;

    add(options?: IBaseNodeCreateOptions<T, U>): void;
    remove(id: IBaseNodeId['id']): void;
    list(): IBaseNodeId['id'][];
}

class BaseNodeManagerOptions<T, U>
    implements IBaseNodeManagerOptions<T, U>
{
    public collection: Map<BaseNodeId['id'], BaseNodeCreateOptions<T, U>>;

    public constructor(options?: BaseNodeCreateOptions<T, U>[]) {
        this.collection = new Map<BaseNodeId['id'], BaseNodeCreateOptions<T, U>>(
            options ? options.map((option: BaseNodeCreateOptions<T, U>) => [option.id.id, option]) : []
        );
    }

    public add(options?: BaseNodeCreateOptions<T, U>): void {
        if (options) {
            if (this.collection.has(options.id.id)) {
                console.error(`Node Options with id ${options.id} already exists.`);
                return;
            }

            this.collection.set(options.id.id, options);
        }
    }

    public remove(id: BaseNodeId['id']): void {
        this.collection.delete(id);
        return;
    }

    public list(): string[] {
        return new Array<string>(...this.collection.keys());
    }
}


interface IBaseNodesManager<T, U> {
    nodes: Map<BaseNodeId['id'], IBaseNode<T, U>>;
    options: IBaseNodeManagerOptions<T, U>;

    create(options?: IBaseNodeCreateOptions<T, U>): void;
    get(id: IBaseNodeId['id']): IBaseNode<T, U> | undefined;
    list(): IBaseNodeId['id'][];
    delete(id: IBaseNodeId['id']): void;
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
    public nodes: Map<BaseNodeId['id'], BaseNode<T, U>>;
    public options: BaseNodeManagerOptions<T, U>;

    public constructor({
        nodes,
        options
    }: {
        nodes?: Map<BaseNodeId['id'], BaseNode<T, U>>,
        options?: BaseNodeManagerOptions<T, U>
    }) {
        this.nodes = nodes ? nodes : new Map<BaseNodeId['id'], BaseNode<T, U>>();
        this.options = new BaseNodeManagerOptions<T, U>(options ? Array.from(options.collection.values()) : []);
    }

    public create(options?: BaseNodeCreateOptions<T, U>): void {

        if (!options) {
            options = new BaseNodeCreateOptions<T, U>();
            return;
        }

        this.options.add(options);

        if (this.nodes.has(options.id.id)) {
            console.error(`Node with id ${options.id} already exists.`);
            return;
        }

        const node = new BaseNode<T, U>(
            options.id,
            options.worker,
            {
                status: BaseNodeStatuses.NEW,
                message: `${options.id}: New node created.`
            } as BaseNodeStatus,
            options.commands,
        );
        this.nodes.set(node.id.id, node);
    }

    public get(id: BaseNodeId['id']): BaseNode<T, U> | undefined {
        const activeNode: BaseNode<T, U> | undefined = this.nodes.get(id);

        if (activeNode) {
            return activeNode;
        }
        else {
            console.error(`Node with id ${id} not found.`);
        }
    }

    public list(): string[] {
        return Array.from(this.nodes.keys());
    }

    public delete(id: BaseNodeId['id']): void {
        // Get the node to delete
        const node: BaseNode<T,U> | undefined = this.nodes.get(id);
        if (!node) {
            console.error(`Node with id ${id} not found.`);
            return;
        }
        else {
            this.nodes.delete(id);
            this.options.remove(id);
        }
    }
}


export {
    BaseNodesManager,
    IBaseNodesManager,
    BaseNodeCreateOptions,
    IBaseNodeCreateOptions,
    NodeInstanceTypes,
    BaseNodeType,
    IBaseNodeManagerOptions,
    BaseNodeManagerOptions,
}


    