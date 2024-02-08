import {
    IBaseNodeCommandPlane,
    BaseNodeCommandPlane,
    BaseNodeCommandActions,
    BaseNodeCommand
} from "./commands.js";
import {
    createRandomId
} from "../../utils/index.js";


interface IBaseNodeId {
    id: string;
}

class BaseNodeId
    implements IBaseNodeId
{
    public id: string;

    public constructor(id?: string) {
        this.id = id ? id : createRandomId();
    }
}

interface IBaseNodeWorker<T, U> {
    worker?: T;

    createWorker: (options?: U) => void;
}

class BaseNodeWorker<T, U>
    implements IBaseNodeWorker<T, U>
{
    public worker: T;

    public constructor(worker?: T, options?: U) {
        this.worker = worker ? worker : this.createWorker(options);
    }

    createWorker = (options?: U): T => {
        return {} as T;
    }
}

enum BaseNodeStatuses {
    NEW = 'new',
    STARTED = 'started',
    STOPPED = 'stopped',
    ERROR = 'error',
    WARNING = 'warning',
    DONE = 'done'
}

interface IBaseNodeStatus {
    status: BaseNodeStatuses;
    message: string;
    error?: Error;
    meta?: any;
}

class BaseNodeStatus
    implements IBaseNodeStatus
{
    public status: BaseNodeStatuses;
    public message: string;
    public error?: Error;
    public meta?: any;

    public constructor(
        status: BaseNodeStatuses,
        message: string,
        error?: Error,
        meta?: any
    ) {
        this.status = status;
        this.message = message;
        this.error = error;
        this.meta = meta;
    }
}

interface IBaseNode<T, U> {
    id: IBaseNodeId;
    status: IBaseNodeStatus;
    commands: IBaseNodeCommandPlane<T, U>;
}


/**
 * @class BaseNode
 * @description The base class for all node instances (IPFS, OrbitDB, Libp2p, etc.)
 * @summary The base class for all node instances
 * @property {IBaseNodeId} id - The System Worker ID of the node
 * @property {IBaseNodeWorker<T, U=null>} worker - The worker for the node instance
 * @property {IBaseNodeStatus} status - The status of the node instance
 * @property {IBaseNodeCommandPlane} commands - The command plane for the node instance
 * @template T - The worker type for the node instance
 * @template U - The options type for the worker
 * 
 */
class BaseNode<T, U>
    implements IBaseNode<T, U>
{
    public id: BaseNodeId;
    public status: BaseNodeStatus;
    public commands: BaseNodeCommandPlane<T, U>;

    public constructor(
        id?: BaseNodeId,
        worker?: BaseNodeWorker<T, U>,
        status?: BaseNodeStatus,
        commands?: BaseNodeCommandActions | BaseNodeCommandPlane<T, U> | BaseNodeCommand[]
    ) {
        this.id = id ? id : new BaseNodeId();
        this.status = status ? status : new BaseNodeStatus(BaseNodeStatuses.NEW, 'New node instance created');
        worker = worker ? worker : new BaseNodeWorker<T, U>();
        
        if (commands instanceof BaseNodeCommandPlane) {
            this.commands = commands;
        }
        else if (Array.isArray(commands)) {
            this.commands = new BaseNodeCommandPlane<T, U>(worker, commands);
        }
        else {
            this.commands = new BaseNodeCommandPlane<T, U>(worker);
        }
    }
}

export {
    IBaseNodeId,
    BaseNodeId,
    IBaseNodeWorker,
    BaseNodeWorker,
    BaseNodeStatuses,
    IBaseNodeStatus,
    BaseNodeStatus,
    IBaseNode,
    BaseNode
}





