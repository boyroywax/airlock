import { ServiceMap } from "@libp2p/interface";
import { Libp2p, createLibp2p, Libp2pOptions } from "libp2p";

import { BaseNode, BaseNodeId, BaseNodeStatus, BaseNodeStatuses, BaseNodeWorker, IBaseNode, IBaseNodeWorker } from "../base/node.js";
import { IBaseNodeCommandActions } from "../base/commands.js";
import { BaseNodeCreateOptions, BaseNodesManager, IBaseNodesManager, BaseNodeManagerOptions } from "../base/manager.js";
import { defaultLibp2pConfig } from "./publicConfigDefault.js";
import e from "express";


class Libp2pNodeCommandActions
    implements IBaseNodeCommandActions
{
    actions: string[] = [
        'dial',
        'dialProtocol',
        'hangUp',
        'closeConnection',
        'listConnections'
    ]
}

class Libp2pNodeWorker<T=Libp2p<ServiceMap>, U=Libp2pOptions> 
    extends BaseNodeWorker<T, U>
    implements IBaseNodeWorker<T, U>
{
    public constructor(
        worker?: T,
        options?: U extends Libp2pOptions ? U : Libp2pOptions
    ) {
        super()
        if (worker) {
            this.worker = worker;
        }
        else {
            this.createWorker(options as U);
        }
    }
    
    public createWorker = async (
        options?: U
    ): Promise<void> => {
        if (!options) {
            options = defaultLibp2pConfig as U;
        }
        this.worker = await createLibp2p(options as Libp2pOptions) as T;
    }
}

class Libp2pNode<T=Libp2p, U=Libp2pOptions>
    extends BaseNode<T, U>
    implements IBaseNode<T, U>
{
    public constructor(
        id: BaseNodeId,
        worker: Libp2pNodeWorker<T, U>,
        status: BaseNodeStatus,
        commands: Libp2pNodeCommandActions
    ) {
        super(
            id,
            worker,
            status,
            commands
        );
    }
}

class Libp2pNodesManager<T=Libp2p, U=Libp2pOptions>
    extends BaseNodesManager<T, U>
    implements IBaseNodesManager<T, U>
{
    public constructor(
        nodes?: Map<BaseNodeId, Libp2pNode<T, U>>,
        options?: BaseNodeManagerOptions<T, U>
    ) {
        super({
            nodes: nodes ? nodes : new Map<BaseNodeId, Libp2pNode<T, U>>(),
            options
        });
    }

    public create = (
        options: BaseNodeCreateOptions<T, U>
    ): void => {
        this.options.add(options);

        const node: Libp2pNode<T, U> = new Libp2pNode(
            options.id,
            options.worker = new Libp2pNodeWorker<T, U>(),
            {
                status: BaseNodeStatuses.NEW,
                message: `${options.id}: New node created.`
            } as BaseNodeStatus,
            options.commands = new Libp2pNodeCommandActions()
        ) as Libp2pNode<T, U>;
        this.nodes.set(node.id, node);
    }
}

export {
    Libp2pNode,
    Libp2pNodeCommandActions,
    Libp2pNodesManager
}