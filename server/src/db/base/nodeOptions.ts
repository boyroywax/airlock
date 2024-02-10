import {
    BaseCommandProperties,
} from "./commands.js";

import {
    BaseWorker
} from "./worker.js";

import {
    Component,
    NodeStatus
} from "../../models/constants.js";

import {
    createRandomId
} from "../../utils/index.js";

import {
    WorkerOptions
} from "./workerOptions.js";




/**
 * @interface INodeOptions
 * @description The Base Node Options Interface
 * @member component: Component - The component type
 * @member id?: string - The System Worker ID of the node
 * @member status?: NodeStatus - The status of the node instance
 * @member commands?: BaseCommandProperties[] - The command plane for the node instance
 * @member workerOptions?: WorkerOptions - The worker options for the node instance
 * @member worker?: BaseWorker - The worker for the node instance
 */
interface INodeOptions {
    component: Component;
    workerOptions?: WorkerOptions;
    id?: string;
    status?: NodeStatus;
    commands?: BaseCommandProperties[];
    worker?: BaseWorker | string ;
}

const defaultNodeOptions = (
    options?: INodeOptions[]
): INodeOptions[] => {
    let id: string = createRandomId();
    
    if (!options) {
        options = new Array<INodeOptions>();
    }
    options.push({
        component: Component.LIBP2P,
        id: Component.LIBP2P + '-' + id,   
    } as INodeOptions, {
        component: Component.IPFS,
        id: Component.IPFS + '-' + id,
        worker: Component.LIBP2P + '-' + id,
    } as INodeOptions, {
        component: Component.ORBITDB,
        id: Component.ORBITDB + '-' + id,
        worker: Component.IPFS + '-' + id,
    } as INodeOptions, {
        component: Component.DB,
        id: Component.DB + '-' + id,
        worker: Component.ORBITDB + '-' + id,
    } as INodeOptions);

    return options;
}





export {
    INodeOptions,
    defaultNodeOptions
}