import {
    BaseWorker
} from "./worker.js";

import {
    NodeStatus
} from "../../models/constants.js";

import {
    createRandomId
} from "../../utils/index.js";

import {
    INodeOptions
}  from "./nodeOptions.js";


/**
 * @interface IBaseNode
 * @description The Base Node Interface
 * @member id: string - The System Worker ID of the node
 * @member status: NodeStatus - The status of the node instance
 * @member worker: BaseWorker - The worker for the node instance
 */
interface IBaseNode {
    id: string;
    status: NodeStatus;
    worker: BaseWorker;
}


/**
 * @class Base
 * @description The base class for all node instances (IPFS, OrbitDB, Libp2p, etc.)
 * @summary The base class for all node instances
 * @property {IBaseId} id - The System Worker ID of the node
 * @property {IBaseWorker | string} worker - The worker for the node instance
 * @property {IBaseStatus} status - The status of the node instance
 * @property {IBaseCommandPlane} commands - The command plane for the node instance
 * 
 */
class BaseNode
    implements IBaseNode
{
    public id: string;
    public status: NodeStatus;
    public worker: BaseWorker

    public constructor({
        component,
        id,
        status,
        commands,
        workerOptions,
        worker
    }: INodeOptions) {
        this.id = id ? id : createRandomId();
        this.status = status ? status : NodeStatus.STOPPED;

        if (worker instanceof BaseWorker) {
            this.worker = worker;
        }
        else {
            this.worker = new BaseWorker({
                type: component,
                options: workerOptions,
                commands: commands
            });
        }
    };
}

export {
    INodeOptions,
    IBaseNode,
    BaseNode
}