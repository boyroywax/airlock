import { OrbitDb, createOrbitDB } from "@orbitdb/core";

import { INodeConfig, IOrbitDBNodeOptions, INodeActionResponse, INode, INodeCommandResponse } from "../../models/index.js";
import { createRandomId } from "../../utils/index.js";
import { IPFSNode } from "../ipfs/node.js";
import { OrbitDBCommands, OrbitDBNodeCommandPlane } from "./commands.js";


const verifyIPFSNode = (ipfsWorker: IPFSNode): IPFSNode['id'] | INodeActionResponse => {
    const workerId: string = ipfsWorker.getWorkerID();
    if (workerId && workerId !== null && workerId !== undefined) {
        return workerId;
    }
    else {
        return {
            code: 202,
            message: "Invalid IPFS Worker",
            error: new Error("Invalid IPFS Worker")
        };
    }
}

class OrbitDBNodeConfig implements INodeConfig {
    public id: string;
    public options: IOrbitDBNodeOptions;
    public instance?: typeof OrbitDb;

    public constructor(
        id: string = createRandomId(),
        options?: IOrbitDBNodeOptions,
        instance?: typeof OrbitDb
    ) {
        this.id = id;
        
        let orbitDbNodeOptions: IOrbitDBNodeOptions | undefined = undefined;

        if (options?.ipfs && options?.enableDID) {
            orbitDbNodeOptions = options;
        }
        else if (options?.ipfs && !options?.enableDID) {
            orbitDbNodeOptions = {
                enableDID: false,
                ipfs: options.ipfs
            }
        }
        else if (!options?.ipfs) {
            throw new Error("Invalid IPFS Worker");
        }

        this.options = orbitDbNodeOptions as IOrbitDBNodeOptions;

        this.instance = instance;
    }
}


class OrbitDBNode implements INode {
    public id: string;
    public instance: typeof OrbitDb;
    public ipfsWorkerID: IPFSNode['id'] | INodeActionResponse;
    public libp2pWorkerID: string | INodeActionResponse;
    public status: INodeActionResponse;
    public commands?: OrbitDBCommands;
    private commandPlane: OrbitDBNodeCommandPlane;


    public constructor({
        id,
        options,
        instance
    }: OrbitDBNodeConfig = new OrbitDBNodeConfig()) {
        this.id = id;
        
        this.status = {
            code: 300,
            message: `OrbitDB Node ${this.id} creation starting...`
        } as INodeActionResponse;

        this.ipfsWorkerID = verifyIPFSNode(options.ipfs);
        this.libp2pWorkerID = options.ipfs.getLibp2pWorkerID()

        let orbitDBInstance: IPFSNode['instance'] | undefined = undefined;

        if ((!instance || instance === null || instance === undefined) &&
        options.ipfs && options.ipfs.getInstance(), options.enableDID
        ) {
            this.status = {
                code: 300,
                message: `OrbitDB Node ${this.id} creation started...`
            } as INodeActionResponse;

            createOrbitDB({
                ipfs: options.ipfs.getInstance()
            }).then((orbitDb: typeof OrbitDb) => {
                orbitDBInstance = orbitDb;

                this.status = {
                    code: 300,
                    message: `OrbitDB Node ${this.id} created`
                } as INodeActionResponse;
            });
        }

        this.instance = orbitDBInstance as typeof OrbitDb;

        this.commandPlane = new OrbitDBNodeCommandPlane(this);
        
        this.status = {
            code: 300,
            message: `OrbitDB Node ${this.id} created`
        } as INodeActionResponse;
    }

    public getPeerID(): string {
        return this.instance.ipfs.libp2p.peerId.toString();
    }

    public getStatus(): INodeActionResponse {
        return this.status;
    }

    public getWorkerID(): string {
        return this.id;
    }

    public getInstance(): any {
        return this.instance;
    }

    public async start(): Promise<INodeActionResponse> {
        let response: INodeActionResponse
        try {
            await this.instance.start()
            response = {
                code: 300,
                message: `OrbitDB Node ${this.id} started`
            }
        } catch (error: any) {
            response = {
                code: 300,
                message: `OrbitDB Node ${this.id} failed to start`,
                error: error
            }
        }
        return response
    }

    public async stop(): Promise<INodeActionResponse> {
        let response: INodeActionResponse
        try {
            await this.instance.stop()
            response = {
                code: 300,
                message: `OrbitDB Node ${this.id} stopped`
            }
        } catch (error: any) {
            response = {
                code: 300,
                message: `OrbitDB Node ${this.id} failed to stop`,
                error: error
            }
        }
        return response
    }

    public async runCommand(command: OrbitDBCommands | string, args: string[]): Promise<INodeCommandResponse> {
        let response: INodeCommandResponse = {
            code: 300,
            message: `Command Executed: ${command} ${args}`
        }

        try {
            response = await this.commandPlane.execute({
                command: command,
                args: args
            });
        }
        catch (error: any) {
            response['error'] = error;
        }
        return response
    }
}


export {
    OrbitDBNode,
    OrbitDBNodeConfig
}