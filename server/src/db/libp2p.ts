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

import {
    createRandomId
} from "../utils/index.js";

class Libp2pNodeCommandActions
    extends BaseNodeCommandActions
    implements IBaseNodeCommandActions
{
    public constructor(
        actions?: Array<BaseNodeCommand>
    ) {
        const defaultActions = [
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
        ] as Array<BaseNodeCommand>;
        
        super(defaultActions)
        console.log(`[Libp2pNodeCommandActions] constructor: actions: ${this.all().toString()}`);
    }
}

class Libp2pNodeWorker<T=Libp2p<ServiceMap>, U=Libp2pOptions> 
    implements IBaseNodeWorker<T, U>
{
    public instance?: T;

    public constructor(
        worker?: T,
        options?: U
    ) {
        if (worker) {
            this.instance = worker;
        }
        else {
            this.createWorker(options).then((worker: T) => {
                this.instance = worker;
            });
        }

    }
    
    public createWorker = async (
        options?: U | Libp2pOptions
    ): Promise<T> => {
        if (!options) {
            options = defaultLibp2pConfig as Libp2pOptions;
        }
        let libp2p: T | undefined;
        try {
            libp2p = await createLibp2p(options) as T;
        }
        catch (error) {
            console.error(`[Libp2pNodeWorker] createWorker: ${error}`);
        }

        if (!libp2p) {
            console.error(`[Libp2pNodeWorker] createWorker: libp2p not created.`);
        }
        return libp2p as T;
        
    }
}

class Libp2pNode<T=Libp2p, U=Libp2pOptions>
    implements IBaseNode<T, U>
{
    public commands: Libp2pNodeCommandPlane<T, U>;
    public id: BaseNodeId;
    public status: BaseNodeStatus;

    public constructor(
        id: BaseNodeId,
        status?: BaseNodeStatus,
        commands?: Libp2pNodeCommandActions | Libp2pNodeCommandPlane<T, U> | BaseNodeCommand[],
        worker?: Libp2pNodeWorker<T, U>

    ) {
        this.status = new BaseNodeStatus(
            status ? status.status : BaseNodeStatuses.NEW,
            status ? status.message : 'Creating new Libp2p Node'
        );

        this.id = id ? id : new BaseNodeId(createRandomId());

        if (!worker) {
            worker = new Libp2pNodeWorker<T, U>();
        }

        if (commands instanceof Libp2pNodeCommandActions) {
            this.commands = new Libp2pNodeCommandPlane<T, U>(worker, commands);
        }
        else if (commands instanceof Libp2pNodeCommandPlane) {
            this.commands = commands;
        }
        else {
            this.commands = new Libp2pNodeCommandPlane<T, U>(worker);
        }
    }
}

class Libp2pNodeCommandPlane<T=Libp2p, U=Libp2pOptions>
    extends BaseNodeCommandPlane<T, U>
    implements IBaseNodeCommandPlane<T, U>
{
    // public commands: Libp2pNodeCommandActions;
    // public worker: Libp2pNodeWorker<T, U>;

    public constructor(
        worker: Libp2pNodeWorker<T, U>,
        commands?: Libp2pNodeCommandActions
    ) { 
        commands = commands ? commands : new Libp2pNodeCommandActions();
        worker = worker;
        super(worker, commands)
    }

    public async run (processId: BaseNodeCommand['processId'], 
        options?: BaseNodeCommandOption): Promise<BaseNodeResponse<any>> 
    {
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

        if (!command) {
            return new BaseNodeResponse<any>(
                400,
                new BaseNodeStatus(BaseNodeStatuses.ERROR, 'Command Not Found')
            );
        }
        else {
            const response: BaseNodeResponse<any> = await this.execute(command);
            command.setOutput(response as BaseNodeResponse<any>);
            return command.output as BaseNodeResponse<any>;
        }

    }

    public execute = async (command: BaseNodeCommand, processId?: string): Promise<BaseNodeResponse<any>> => {
        let response;

        let worker = this.worker.instance as Libp2p;
        console.log('[Libp2pNodeCommandPlane] execute: worker: ', worker);

        console.log('[Libp2pNodeCommandPlane] execute: command: ', command, worker);

        const processID = processId ? processId : command.process.action;
        console.log(`[Libp2pNodeCommandPlane] execute: processID: ${processID}`);

        switch (processID) {
            case "id":
                const peerId: PeerId = worker.peerId
                console.log(`[Libp2pNodeCommandPlane] execute: peerId: ${peerId}`);
                return new BaseNodeResponse(
                    BaseNodeResponseCode.SUCCESS,
                    new BaseNodeStatus(BaseNodeStatuses.DONE, 'Peer ID Listed'),
                    new BaseNodeResponseObject<PeerId>(peerId)
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
    public id: BaseNodeId;
    public type: BaseNodeType;
    public worker: Libp2pNodeWorker<T, U>;
    public commands: Libp2pNodeCommandPlane<T, U>;
    public params: any[];
    
    public constructor(
        id?: BaseNodeId,
        type?: NodeInstanceTypes | BaseNodeType,
        worker?: Libp2pNodeWorker<T, U>,
        commands?: Libp2pNodeCommandPlane<T, U> | Libp2pNodeCommandActions,
        params?: any
    ) {
        super();
        if (id) {
            this.id = id;
        }
        else {
            this.id = new BaseNodeId(
                createRandomId()
            );
        }

        if (!params) { this.params = []; } else { this.params = params; }

        if (type instanceof BaseNodeType) {
            this.type = type;
        }
        else if (typeof type === 'string') {
            this.type = new BaseNodeType(type);
        }
        else {
            this.type = new BaseNodeType();
        }

        if (worker) {
            this.worker = worker;
        }
        else {
            this.worker = new Libp2pNodeWorker<T, U>();
        }

        if (commands instanceof Libp2pNodeCommandPlane) {
            this.commands = commands;
        }
        else if (commands instanceof Libp2pNodeCommandActions) {
            this.commands = new Libp2pNodeCommandPlane<T, U>(this.worker, commands);
        }
        else {
            this.commands = new Libp2pNodeCommandPlane<T, U>(this.worker);
        }

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
        nodes?: Map<BaseNodeId['id'], Libp2pNode<T, U>>,
        options?: Libp2pNodeManagerOptions<T, U>
    ) {
        super({
            nodes: nodes ? nodes : new Map<BaseNodeId['id'], Libp2pNode<T, U>>(),
            options: options ? options : new Libp2pNodeManagerOptions<T, U>()
        });
    }

    public create = (
        options?: Libp2pNodeCreateOptions<T, U>
    ): void => {
        options = options ? options : new Libp2pNodeCreateOptions<T, U>();
        this.options.add(options);

        // const worker = options.worker.instance ? options.worker.instance : new Libp2pNodeWorker<T, U>(
        //     undefined,
        //     defaultLibp2pConfig as U
        // )

        const node = new Libp2pNode<T, U>(
            options.id,
            new BaseNodeStatus(BaseNodeStatuses.NEW, 'Node Created'),
            options.commands
        );


        this.nodes.set(node.id.id, node);
    }
}

export {
    Libp2pNode,
    Libp2pNodesManager,
    Libp2pNodeManagerOptions,
    Libp2pNodeCreateOptions,
    Libp2pNodeCommandActions
}