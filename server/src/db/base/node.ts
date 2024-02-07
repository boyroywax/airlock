import { IBaseNodeCommandPlane, BaseNodeCommandPlane, BaseNodeCommandActions } from "./commands.js";
import { createRandomId } from "../../utils/index.js";


interface IBaseNodeId {
    id: string;
}

class BaseNodeId implements IBaseNodeId {
    public id: string;

    public constructor(id?: string) {
        this.id = id ? id : createRandomId();
    }
}

interface IBaseNodeWorker<T> {
    worker: T;
}

class BaseNodeWorker<T> implements IBaseNodeWorker<T> {
    public worker: T;

    public constructor(worker: T) {
        this.worker = worker
    }
}

enum BaseNodeStatuses {
    NEW = 'new',
    STARTED = 'started',
    STOPPED = 'stopped',
    ERROR = 'error',
    WARNING = 'warning',
}

interface IBaseNodeStatus {
    status: BaseNodeStatuses;
    message: string;
    error?: Error;
    meta?: any;
}

class BaseNodeStatus implements IBaseNodeStatus {
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

interface IBaseNode<T> {
    id: IBaseNodeId;
    worker: IBaseNodeWorker<T>;
    status: IBaseNodeStatus;
    commands: IBaseNodeCommandPlane;
}


/**
 * @class BaseNode
 * @description The base class for all node instances (IPFS, OrbitDB, Libp2p, etc.)
 * @summary The base class for all node instances
 * @property {IBaseNodeId} id - The System Worker ID of the node
 * @property {IBaseNodeWorker<T>} worker - The worker for the node instance
 * @property {IBaseNodeStatus} status - The status of the node instance
 * @property {IBaseNodeCommandPlane} commands - The command plane for the node instance
 * @template T - The worker type for the node instance
 * @template U - The returned object type of the commands
 * 
 */
class BaseNode<T> implements IBaseNode<T> {
    public id: BaseNodeId;
    public worker: BaseNodeWorker<T>;
    public status: BaseNodeStatus;
    public commands: BaseNodeCommandPlane;

    public constructor(
        id: BaseNodeId,
        worker: BaseNodeWorker<T>,
        status: BaseNodeStatus,
        commands?: BaseNodeCommandActions
    ) {
        this.id = id;
        this.worker = worker;
        this.status = status;
        this.commands = new BaseNodeCommandPlane(commands);
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





