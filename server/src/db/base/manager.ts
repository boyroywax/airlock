import {
    IBaseCommandActions,
    BaseCommandActions,
    BaseCommandPlane,
    BaseCommand,
    IBaseCommand,
    IBaseCommandPlane
} from "./commands.js";

import {
    IBase,
    Base,
    IBaseId,
    IBaseWorker,
    BaseStatuses,
    BaseStatus,
    BaseId,
    BaseWorker
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

interface IBaseType {
    type: NodeInstanceTypes;
}

class BaseType
    implements IBaseType
{
    public type: NodeInstanceTypes;

    public constructor(
        type?: NodeInstanceTypes | string
    ) {
        if (typeof type === 'string') {
            this.type = NodeInstanceTypes[type as keyof typeof NodeInstanceTypes];
        }
        else {
            this.type = NodeInstanceTypes.UNDEFINED;
        }
    }
}

interface IBaseCreateOptions<T, U> {
    id: IBaseId;
    type: IBaseType;
    worker: IBaseWorker<T, U>;
    commands: IBaseCommandActions | IBaseCommand[] | IBaseCommandPlane<T, U>;
    params: string[] | any[];
}

class BaseCreateOptions<T, U>
    implements IBaseCreateOptions<T, U>
{
    public id: BaseId;
    public type: BaseType;
    public worker: BaseWorker<T, U>;
    public commands: BaseCommandPlane<T, U>;
    public params: string[] | any[];

    public constructor(
        id?: IBaseId,
        type?: BaseType,
        worker?: BaseWorker<T, U>,
        commands?: BaseCommandActions | BaseCommand[] | BaseCommandPlane<T, U>,
        params?: string[]
    ) {
        this.id = id ? id : new BaseId(createRandomId());
        this.type = type ? type: new BaseType();
        this.worker = worker ? worker : new BaseWorker<T, U>();
        
        if (commands instanceof BaseCommandPlane) {
            this.commands = commands;
        }
        else if (commands instanceof BaseCommandActions) {
            this.commands = new BaseCommandPlane<T, U>(this.worker, commands);
        }
        else {
            this.commands = new BaseCommandPlane<T, U>(this.worker);
        }
        this.params = params ? params : [];
    }
}

interface IBaseManagerOptions<T, U> {
    collection: Map<IBaseId['id'], IBaseCreateOptions<T, U>>;

    add(options?: IBaseCreateOptions<T, U>): void;
    remove(id: IBaseId['id']): void;
    list(): IBaseId['id'][];
}

class BaseManagerOptions<T, U>
    implements IBaseManagerOptions<T, U>
{
    public collection: Map<BaseId['id'], BaseCreateOptions<T, U>>;

    public constructor(options?: BaseCreateOptions<T, U>[]) {
        this.collection = new Map<BaseId['id'], BaseCreateOptions<T, U>>(
            options ? options.map((option: BaseCreateOptions<T, U>) => [option.id.id, option]) : []
        );
    }

    public add(options?: BaseCreateOptions<T, U>): void {
        if (options) {
            if (this.collection.has(options.id.id)) {
                console.error(`Node Options with id ${options.id} already exists.`);
                return;
            }

            this.collection.set(options.id.id, options);
        }
    }

    public remove(id: BaseId['id']): void {
        this.collection.delete(id);
        return;
    }

    public list(): string[] {
        return new Array<string>(...this.collection.keys());
    }
}


interface IBasesManager<T, U> {
    nodes: Map<BaseId['id'], IBase<T, U>>;
    options: IBaseManagerOptions<T, U>;

    create(options?: IBaseCreateOptions<T, U>): void;
    get(id: IBaseId['id']): IBase<T, U> | undefined;
    list(): IBaseId['id'][];
    delete(id: IBaseId['id']): void;
}


/**
 * @class BasesManager
 * @description The manager for base nodes
 * @summary The manager for base nodes
 * @implements IBasesManager
 * @template T - The type of the worker
 * @template U - The options type for the worker
 * 
 */
class BasesManager<T, U>
    implements IBasesManager<T, U>
{
    public nodes: Map<BaseId['id'], Base<T, U>>;
    public options: BaseManagerOptions<T, U>;

    public constructor({
        nodes,
        options
    }: {
        nodes?: Map<BaseId['id'], Base<T, U>>,
        options?: BaseManagerOptions<T, U>
    }) {
        this.nodes = nodes ? nodes : new Map<BaseId['id'], Base<T, U>>();
        this.options = new BaseManagerOptions<T, U>(options ? Array.from(options.collection.values()) : []);
    }

    public create(options?: BaseCreateOptions<T, U>): void {

        if (!options) {
            options = new BaseCreateOptions<T, U>();
            return;
        }

        this.options.add(options);

        if (this.nodes.has(options.id.id)) {
            console.error(`Node with id ${options.id} already exists.`);
            return;
        }

        const node = new Base<T, U>(
            options.id,
            options.worker,
            {
                status: BaseStatuses.NEW,
                message: `${options.id}: New node created.`
            } as BaseStatus,
            options.commands,
        );
        this.nodes.set(node.id.id, node);
    }

    public get(id: BaseId['id']): Base<T, U> | undefined {
        const activeNode: Base<T, U> | undefined = this.nodes.get(id);

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

    public delete(id: BaseId['id']): void {
        // Get the node to delete
        const node: Base<T,U> | undefined = this.nodes.get(id);
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
    BasesManager,
    IBasesManager,
    BaseCreateOptions,
    IBaseCreateOptions,
    NodeInstanceTypes,
    BaseType,
    IBaseManagerOptions,
    BaseManagerOptions,
}


    