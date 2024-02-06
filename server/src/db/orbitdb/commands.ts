import { Database } from "@orbitdb/core";

import { OrbitDBNode } from "./node.js";
import { INodeCommand, INodeCommandPlane, INodeCommandResponse } from "../../models/index.js";
import { LogBookNames } from "../../models/logs";
import { getLogBook, LogBook } from "../../utils/logBook.js";

const logger: LogBook  = getLogBook(LogBookNames.ORBITDB)

enum OrbitDBNodeCommands {
    OPEN = 'open'
}

class OrbitDBNodeCommand implements INodeCommand {
    public command: OrbitDBNodeCommands | string;
    public args: string[];

    public constructor(
        command: OrbitDBNodeCommands | string,
        args: string[] = []
    ) {
        this.command = command;
        this.args = args;
    }
}

class OrbitDBNodeCommandPlane implements INodeCommandPlane {
    public nodeWorker: OrbitDBNode;

    public constructor(
        node: OrbitDBNode,
    ) {
        this.nodeWorker = node;
    }

    public async execute(command: OrbitDBNodeCommand | INodeCommand ): Promise<INodeCommandResponse> {
        let response: INodeCommandResponse = {
            code: 300,
            message: `Command Executed: ${command.command} ${command.args}`
        }

        switch (command.command as OrbitDBNodeCommands) {
            case OrbitDBNodeCommands.OPEN:
                response = await this.openDatabase(command.args?.[0] as string)
                break;
            default:
                response = {
                    code: 404,
                    message: `Command Not Found - ${command.command} ${command.args}`
                }
        }

        return response
    }

    private async openDatabase(name: string): Promise<typeof Database | INodeCommandResponse> {
        let response: INodeCommandResponse = {
            code: 300,
            message: `Database ${name} Opened`
        }

        try {
            return await this.nodeWorker.instance.open(name)
        } catch (error: any) {
            response = {
                code: 302,
                message: `Database ${name} Failed to Open`,
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