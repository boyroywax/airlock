import {
    IBaseNode,
    BaseNode,
    INodeOptions
} from "./node.js";

import {
    Component,
    LogLevel,
    ResponseCode
} from "../../models/constants.js";

import {
    createRandomId,
    logger
} from "../../utils/index.js";

import { BaseWorker } from "./worker.js";
import { defaultNodeOptions } from "./nodeOptions.js";


interface IBasesManager {
    nodes: Map<IBaseNode['id'], IBaseNode>;

    verifyOptions(options: INodeOptions): INodeOptions;
    create(options?: INodeOptions[]): IBaseNode[];
    get(id: IBaseNode['id']): IBaseNode | undefined;
    getComponents(type: Component): IBaseNode[];
    list(): IBaseNode['id'][];
    delete(id: IBaseNode['id']): void;
}


/**
 * @class BasesManager
 * @description The manager for base nodes
 * @implements IBasesManager
 * @member nodes: Map<IBaseNode['id'], IBaseNode> - The map of base nodes
 */
class BasesManager
    implements IBasesManager
{
    public nodes: Map<BaseNode['id'], BaseNode>;

    public constructor({
        nodes,
        options
    }: {
        nodes?: BaseNode[],
        options?: INodeOptions[]
    }) {
        if (!nodes) {
            nodes = new Array<BaseNode>();
        }

        if (!options) {
            options = defaultNodeOptions();
        }

        nodes = this.create(options);

        this.nodes = nodes ? new Map<BaseNode['id'], BaseNode>(
            nodes.map((node: BaseNode) => [node.id, node])
        ) : new Map<BaseNode['id'], BaseNode>();
        
    }

    public create(options: INodeOptions[]): BaseNode[] {
        let newNodes = new Array<BaseNode>();
        for (let option of options) {
            option = this.verifyOptions(option);
            try {
                newNodes.push(new BaseNode(option));
                logger({
                    level: LogLevel.INFO,
                    component: option.component,
                    code: ResponseCode.SUCCESS,
                    message: `[${option.id}] Created new ${option.component} node with id ${option.id}`
                })
            } catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    component: option.component,
                    code: ResponseCode.INTERNAL_SERVER_ERROR,
                    message: `[${option.id}] Error creating new node: ${error}`
                })
            }
        }
        return newNodes;
    }

    public get(id: BaseNode['id']): BaseNode | undefined {
        const activeNode: BaseNode | undefined = this.nodes.get(id);

        if (activeNode) {
            return activeNode;
        }
        else {
            logger({
                level: LogLevel.ERROR,
                component: Component.SYSTEM,
                code: ResponseCode.NOT_FOUND,
                message: `Node with id ${id} not found.`
            });
        }
    }

    public getComponents(type: Component): BaseNode[] {
        return Array.from(this.nodes.values())
            .filter((node: BaseNode) => 
                node.worker.type === type
            );
    }

    public verifyOptions = (
        options: INodeOptions
    ): INodeOptions => {
        if (options.workerOptions) {
            let workerOptions = options.workerOptions;
            let worker: any = options.worker;
    
            if (workerOptions && worker) {
                if (typeof worker === 'string') {
                    worker = this.get(worker);
                }
            }
        }
        return options;
    }


    public list(): string[] {
        return Array.from(this.nodes.keys());
    }

    public delete(id: BaseNode['id']): void {
        // Get the node to delete
        const node: BaseNode | undefined = this.nodes.get(id);
        if (!node) {
            console.error(`Node with id ${id} not found.`);
            return;
        }
        else {
            this.nodes.delete(id);
        }
    }
}


export {
    BasesManager,
    IBasesManager,
}


    