import { INodeActionResponse } from "../../models/index.js";
import { OpenDBCommandPlane, OpenDBCommands } from "./commands.js";
import { INode, INodeCommand, INodeCommandResponse, INodeConfig } from "../../models/node.js";
import { createRandomId } from "../../utils/index.js";
import { Database } from "@orbitdb/core";
import { IOpenDBOptions, IOrbitDBOptions } from "../../models/orbitdb.js";

class OpenDBConfig implements INodeConfig {
    public id: string;
    public options: IOpenDBOptions;
    public instance?: typeof Database;

    public constructor(
        id: string = createRandomId(),
        instance: typeof Database,
        options: IOpenDBOptions,

    ) {
        this.id = id;
        this.options = options;
        this.instance = instance;
    }
}


class OpenDB implements INode {
    public id: string;
    public instance: typeof Database;
    public status: INodeActionResponse;
    public options: IOpenDBOptions;
    public commands?: OpenDBCommands;
    private commandPlane: OpenDBCommandPlane;

    public constructor({
        id,
        options,
        instance
    }: OpenDBConfig) {
        this.id = id;
        this.options = options;
        this.instance = instance;
        this.status = {
            code: 100,
            message: "OpenDB Node Created"
        }
        this.commandPlane = new OpenDBCommandPlane(this.instance);
    }

    public getInstance(): typeof OpenDB {
        return this.instance;
    }

    public getPeerID(): string {
        return this.instance.address.toString();
    }

    public getStatus(): INodeActionResponse {
        return this.status;
    }

    public getWorkerID(): string {
        return this.id;
    }

    public async start(): Promise<INodeActionResponse> {
        let response: INodeActionResponse = {
            code: 100,
            message: "OpenDB Node Started"
        }

        return response;
    }

    public async stop(): Promise<INodeActionResponse> {
        let response: INodeActionResponse = {
            code: 100,
            message: "OpenDB Node Stopped"
        }

        return response;
    }

    public async command(command: INodeCommand): Promise<INodeCommandResponse> {
        return await this.commandPlane.execute(command);
    }
}

export {
    OpenDB,
    OpenDBConfig
}