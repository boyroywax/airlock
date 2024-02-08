import {
    ServiceMap,
    Connection,
    PeerId,
    Libp2pStatus
} from "@libp2p/interface";

import {
    Libp2p,
    createLibp2p,
    Libp2pOptions,
} from "libp2p";

import {
    multiaddr
} from "@multiformats/multiaddr";

import {
    BaseNode,
    BaseNodeId,
    BaseNodeStatus,
    BaseNodeStatuses,
    BaseNodeWorker,
    IBaseNode,
    IBaseNodeWorker,
} from "./base/node.js";

import {
    BaseNodeCreateOptions,
    BaseNodesManager,
    IBaseNodesManager,
    BaseNodeManagerOptions,
    IBaseNodeCreateOptions,
    NodeInstanceTypes,
    BaseNodeType,
    IBaseNodeManagerOptions,
} from "./base/manager.js";

import { 
    defaultLibp2pConfig
} from "./publicConfigDefault.js";

import {
    BaseNodeCommand,
    BaseNodeCommandActions,
    BaseNodeCommandPlane,
    IBaseNodeCommandActions,
    IBaseNodeCommandPlane,
} from "./base/commands.js";

import {
    BaseNodeCommandOption,
    BaseNodeResponse,
    BaseNodeResponseCode,
    BaseNodeResponseObject
} from "./base/index.js";

class Libp2pNodeCommandActions
    extends BaseNodeCommandActions
    implements IBaseNodeCommandActions
{
    public constructor(
        actions?: Array<BaseNodeCommand>
    ) {
        super(actions ? actions : [
            new BaseNodeCommand(
                new BaseNodeCommandOption(
                    'start'
                ),
                'start'
            ),
            new BaseNodeCommand(
                new BaseNodeCommandOption(
                    'stop'
                ),
                'stop'
            ),
            new BaseNodeCommand(
                new BaseNodeCommandOption(
                    'dial'
                ),
                'connect:dial'
            ),
            new BaseNodeCommand(
                new BaseNodeCommandOption(
                    'id'
                ),
                'id'
            ),
            new BaseNodeCommand(
                new BaseNodeCommandOption(
                    'getConnections'
                ),
                'connections:get'
            ),
            new BaseNodeCommand(
                new BaseNodeCommandOption(
                    'getPeers'
                ),
                'peer:get'
            ),
            new BaseNodeCommand(
                new BaseNodeCommandOption(
                    'getStatus'
                ),
                'status:get'
            ),
        ] as Array<BaseNodeCommand>);
    }
}

class Libp2pNodeWorker<T=Libp2p<ServiceMap>, U=Libp2pOptions> 
    extends BaseNodeWorker<T, U>
    implements IBaseNodeWorker<T, U>
{
    public constructor(
        worker: T,
        options?: U
    ) {
        super()
        if (worker) {
            this.worker = worker;
        }
        else {
            this.createWorker(options as U);
        }
    }
    
    public createWorker = (
        options?: U
    ): T => {
        if (!options) {
            options = defaultLibp2pConfig as U;
        }
        let libp2p: T | undefined = undefined;
        try {
            createLibp2p(options as Libp2pOptions)
            .then( (node: Libp2p) => {
                libp2p = node as T;
            }) as T;
        }
        catch (error) {
            throw console.error(`[Libp2pNodeWorker] createWorker: ${error}`);
        }

        if (!libp2p) {
            throw console.error(`[Libp2pNodeWorker] createWorker: libp2p not created.`);
        }
        return libp2p;
        
        
    }
}

class Libp2pNode<T=Libp2p, U=Libp2pOptions>
    extends BaseNode<T, U>
    implements IBaseNode<T, U>
{
    public commands: Libp2pNodeCommandPlane<T, U>;

    public constructor(
        id: BaseNodeId,
        worker: Libp2pNodeWorker<T, U>,
        status: BaseNodeStatus,
        commands: Libp2pNodeCommandActions | Libp2pNodeCommandPlane<T, U> | BaseNodeCommand[]
    ) {
        super(
            id,
            worker,
            status,
            commands
        );
        this.commands = commands instanceof Libp2pNodeCommandActions ? new Libp2pNodeCommandPlane<T, U>(worker, commands) : commands as Libp2pNodeCommandPlane<T, U>;
    }
}

class Libp2pNodeCommandPlane<T=Libp2p, U=Libp2pOptions>
    extends BaseNodeCommandPlane<T, U>
    implements IBaseNodeCommandPlane<T, U>
{
    public commands: Libp2pNodeCommandActions;
    public worker: Libp2pNodeWorker<T, U>;

    public constructor(
        worker: Libp2pNodeWorker<T, U>,
        commands?: Libp2pNodeCommandActions
    ) { 
        super(
            worker,
            commands
        );

        this.commands = commands ? commands : new Libp2pNodeCommandActions([]);
        this.worker = worker;
    }

    public run(processId: BaseNodeCommand['processId']): BaseNodeResponse<any> {
        let command: BaseNodeCommand; 

        if (processId) {
            command = this.commands.actions.get(processId) as BaseNodeCommand;
        }
        else {
            command = new BaseNodeCommand(
                new BaseNodeCommandOption('undefined', [], {}),
                'undefined'
            );
        }

        this.execute(command).then( (response) => {
            command.setOutput(response);
        });

        return command.output ? command.output : new BaseNodeResponse(
            400,
            new BaseNodeStatus(BaseNodeStatuses.ERROR, 'Command Not Found')
        ) 
    }

    public execute = async (command: BaseNodeCommand): Promise<BaseNodeResponse<any>> => {
        let response;

        const worker = this.worker.worker as Libp2p<ServiceMap>;

        switch (command.process.action) {
            case "id":
                const peerId: string = worker.peerId.toString()
                return new BaseNodeResponse(
                    BaseNodeResponseCode.SUCCESS,
                    new BaseNodeStatus(BaseNodeStatuses.DONE, 'Peer ID Listed'),
                    new BaseNodeResponseObject<string>(peerId)
                );
            case 'dial':
                const connection: Connection = await worker.dial(multiaddr(command.process.args[0]));
                return new BaseNodeResponse(
                    BaseNodeResponseCode.SUCCESS,
                    new BaseNodeStatus(BaseNodeStatuses.DONE, 'Connection Established'),
                    new BaseNodeResponseObject<Connection>(connection)
                );
            case 'getConnections':
                const connections: Connection[] = worker.getConnections();
                return new BaseNodeResponse(
                    BaseNodeResponseCode.SUCCESS,
                    new BaseNodeStatus(BaseNodeStatuses.DONE, 'Connections Listed'),
                    new BaseNodeResponseObject<Connection[]>(connections)
                );
            case 'getPeerInfo':
                const peerInfo: PeerId[] = worker.getPeers();
                return new BaseNodeResponse(
                    BaseNodeResponseCode.SUCCESS,
                    new BaseNodeStatus(BaseNodeStatuses.DONE, 'Peer Info Listed'),
                    new BaseNodeResponseObject<PeerId[]>(peerInfo)
                );
            case 'getStatus':
                const libp2pStatus: Libp2pStatus = worker.status;
                return new BaseNodeResponse(
                    200,
                    new BaseNodeStatus(BaseNodeStatuses.STARTED, 'Node Status Listed'),
                    libp2pStatus as any
                );
            default:
                response = new BaseNodeResponse(
                    400,
                    new BaseNodeStatus(BaseNodeStatuses.ERROR, 'Command Not Found')
                );
                break;
        }
        return response ? response : new BaseNodeResponse(
            200,
            new BaseNodeStatus(BaseNodeStatuses.STARTED, `${command.process.action} Command Executed`)
            );

    }
}

class Libp2pNodeCreateOptions<T=Libp2p, U=Libp2pOptions>
    extends BaseNodeCreateOptions<T, U>
    implements IBaseNodeCreateOptions<T, U>
{
    public constructor(
        id?: BaseNodeId,
        worker?: Libp2pNodeWorker<T, U>,
        commands?: Libp2pNodeCommandPlane<T, U>
    ) {
        super(
            id,
            new BaseNodeType<T>(NodeInstanceTypes.LIBP2P),
            worker,
            commands
        );
    }
}

class Libp2pNodeManagerOptions<T=Libp2p, U=Libp2pOptions> 
    extends BaseNodeManagerOptions<T, U>
    implements IBaseNodeManagerOptions<T, U>
{
    public constructor(
        collection?: Libp2pNodeCreateOptions<T, U>[]
    ) {
        super(collection);
    }


}

class Libp2pNodesManager<T=Libp2p, U=Libp2pOptions>
    extends BaseNodesManager<T, U>
    implements IBaseNodesManager<T, U>
{
    public constructor(
        nodes?: Map<BaseNodeId, Libp2pNode<T, U>>,
        options?: Libp2pNodeManagerOptions<T, U>
    ) {
        super({
            nodes: nodes ? nodes : new Map<BaseNodeId, Libp2pNode<T, U>>(),
            options: options ? options : new Libp2pNodeManagerOptions<T, U>()
        });
    }

    public create = (
        options?: Libp2pNodeCreateOptions<T, U>
    ): void => {
        options = options ? options : new Libp2pNodeCreateOptions<T, U>();
        this.options.add(options);

        const libp2pOptions: Libp2pOptions = options.worker.worker ? options.worker.worker : defaultLibp2pConfig;

        const node: Libp2pNode<T, U> = new Libp2pNode<T, U>(
            options.id,
            options.worker,
            new BaseNodeStatus(BaseNodeStatuses.NEW, `${options.id}: New node created.`),
            options.commands
        );

        this.nodes.set(node.id, node);
    }
}

export {
    Libp2pNode,
    Libp2pNodesManager,
    Libp2pNodeCreateOptions,
    Libp2pNodeCommandActions
}