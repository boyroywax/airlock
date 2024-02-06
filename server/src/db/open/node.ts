import { INodeActionResponse } from "../../models";
import { OpenDBCommandPlane, OpenDBCommands } from "./commands";
import { INode, INodeCommand, INodeCommandResponse, INodeConfig } from "../../models/node";
import { createRandomId } from "../../utils";
import { Database } from "@orbitdb/core";
import { IOrbitDBOptions } from "../../models/orbitdb";

class OpenDBConfig implements INodeConfig {
    public id: string;
    public options?: IOrbitDBOptions;
    public instance?: typeof Database;

    public constructor(
        id: string = createRandomId(),
        instance: typeof Database,
        options?: IOrbitDBOptions,

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
    public commands?: OpenDBCommands;
    private commandPlane: OpenDBCommandPlane;

    public constructor({
        id,
        instance
    }: OpenDBConfig) {
        this.id = id;
        this.instance = instance;
        this.status = {
            code: 100,
            message: "OpenDB Node Created"
        }
        this.commandPlane = new OpenDBCommandPlane(this);
    }

    public getInstance(): typeof OpenDB {
        return this.instance;
    }

    public getPeerID(): string {
        return this.instance?.address.root;
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