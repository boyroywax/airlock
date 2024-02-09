import {
    IBaseCommandPlane,
    BaseCommandPlane,
    BaseCommandActions,
    BaseCommand
} from "./commands.js";
import {
    createRandomId
} from "../../utils/index.js";




interface IBaseId {
    id: string;
}

class BaseId
    implements IBaseId
{
    public id: string;

    public constructor(id?: string) {
        this.id = id ? id : createRandomId();
    }
}

enum BaseStatuses {
    NEW = 'new',
    STARTED = 'started',
    STOPPED = 'stopped',
    ERROR = 'error',
    WARNING = 'warning',
    DONE = 'done'
}

interface IBaseStatus {
    status: BaseStatuses;
    message: string;
    error?: Error;
    meta?: any;
}

class BaseStatus
    implements IBaseStatus
{
    public status: BaseStatuses;
    public message: string;
    public error?: Error;
    public meta?: any;

    public constructor(
        status: BaseStatuses,
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

interface IBase<T, U> {
    id: IBaseId;
    status: IBaseStatus;
    commands: IBaseCommandPlane<T, U>;
}


/**
 * @class Base
 * @description The base class for all node instances (IPFS, OrbitDB, Libp2p, etc.)
 * @summary The base class for all node instances
 * @property {IBaseId} id - The System Worker ID of the node
 * @property {IBaseWorker<T, U=null>} worker - The worker for the node instance
 * @property {IBaseStatus} status - The status of the node instance
 * @property {IBaseCommandPlane} commands - The command plane for the node instance
 * @template T - The worker type for the node instance
 * @template U - The options type for the worker
 * 
 */
class Base<T, U>
    implements IBase<T, U>
{
    public id: BaseId;
    public status: BaseStatus;
    public commands: BaseCommandPlane<T, U>;

    public constructor(
        id?: BaseId,
        worker?: BaseWorker<T, U>,
        status?: BaseStatus,
        commands?: BaseCommandActions | BaseCommandPlane<T, U> | BaseCommand[]
    ) {
        this.id = id ? id : new BaseId();
        this.status = status ? status : new BaseStatus(BaseStatuses.NEW, 'New node instance created');
        worker = worker ? worker : new BaseWorker<T, U>();
        
        if (commands instanceof BaseCommandPlane) {
            this.commands = commands;
        }
        else if (Array.isArray(commands)) {
            this.commands = new BaseCommandPlane<T, U>(worker, commands);
        }
        else {
            this.commands = new BaseCommandPlane<T, U>(worker);
        }
    }
}

export {
    IBaseId,
    BaseId,
    BaseStatuses,
    IBaseStatus,
    BaseStatus,
    IBase,
    Base
}





