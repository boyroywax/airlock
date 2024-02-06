import { Database, OrbitDB } from "@orbitdb/core";

import { OrbitDBNode } from "./node.js";
import { INodeCommand, INodeCommandPlane, INodeCommandResponse } from "../../models/index.js";
import { LogBookNames } from "../../models/logs.js";
import { getLogBook, LogBook } from "../../utils/logBook.js";
import { IOrbitDBOptions } from "../../models/orbitdb.js";

const logger: LogBook  = getLogBook(LogBookNames.ORBITDB)

enum OrbitDBNodeCommands {
    OPEN = 'open'
}

class OrbitDBNodeCommand implements INodeCommand {
    public command: OrbitDBNodeCommands;
    public args: IOrbitDBOptions;

    public constructor(
        command: OrbitDBNodeCommands,
        args: IOrbitDBOptions
    ) {
        this.command = command;
        this.args = args;
    }
}

class OrbitDBNodeCommandPlane implements INodeCommandPlane {
    public nodeWorker: typeof OrbitDB;

    public constructor(
        node: typeof OrbitDB,
    ) {
        this.nodeWorker = node;
    }

    public async execute(command: OrbitDBNodeCommand): Promise<INodeCommandResponse> {
        let response: INodeCommandResponse = {
            code: 300,
            message: `Command Executed: ${command.command} ${command.args}`
        }

        switch (command.command as OrbitDBNodeCommands) {
            case OrbitDBNodeCommands.OPEN:
                response = await this.openDatabase(command)
                break;
            default:
                response = {
                    code: 404,
                    message: `Command Not Found - ${command.command} ${command.args}`
                }
        }

        return response
    }

    private async openDatabase(command: OrbitDBNodeCommand): Promise<typeof Database | INodeCommandResponse> {
        const name: string = command.args.databaseName
        const type: string = command.args.databaseType

        let response: INodeCommandResponse = {
            code: 300,
            message: `Database ${command.args} Opened`
        }

        try {
            return await this.nodeWorker.instance.open(name, { type: type})
        } catch (error: any) {
            response = {
                code: 302,
                message: `Database ${name} of type ${type} Failed to Open`,
                error: error
            }
        }

        return response
    }
}

export {
    OrbitDBNodeCommands,
    OrbitDBNodeCommand,
    OrbitDBNodeCommandPlane
}