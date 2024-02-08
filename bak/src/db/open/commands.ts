import { Database } from '@orbitdb/core';
import { INodeCommand, IOpenDBCommandPlane, INodeCommandResponse } from '../../models';



enum OpenDBCommands {
    CLOSE = 'close',
    GET = 'get',
    ALL = 'all',
    ADD = 'add',
    PUT = 'put'
}

class OpenDBCommandPlane implements IOpenDBCommandPlane {
    public db: typeof Database;

    public constructor(
        db: typeof Database
    ) {
        this.db = db;
    }

    public async execute(command: OpenDBCommands | INodeCommand, args: string[] = []): Promise<INodeCommandResponse> {
        let response: any = {
            code: 300,
            message: `Command Executed: ${command} ${args}`
        }

        switch (command) {
            case OpenDBCommands.CLOSE:
                response = await this.closeDatabase()
                break;
            case OpenDBCommands.GET:
                response = await this.getEntry(args[0])
                break;
            case OpenDBCommands.ALL:
                response = await this.getAllEntries()
                break;
            case OpenDBCommands.ADD:
                response = await this.addEntry(args[0])
                break;
            case OpenDBCommands.PUT:
                response = await this.putEntry(args[0], args[1])
                break;
            default:
                response = {
                    code: 404,
                    message: `Command Not Found - ${command} ${args}`
                }
        }

        return response
    }

    private async closeDatabase(): Promise<any> {
        return await this.db.close()
    }

    private async getEntry(name: string): Promise<any> {
        return await this.db.get(name)
    }

    private async getAllEntries(): Promise<any> {
        return await this.db.all
    }

    private async addEntry(name: string): Promise<any> {
        return await this.db.add(name)
    }

    private async putEntry(name: string, value: any): Promise<any> {
        return await this.db.put(name, value)
    }
}



export {
    OpenDBCommands,
    OpenDBCommandPlane
}