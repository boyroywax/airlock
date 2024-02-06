import { Database } from '@orbitdb/core';

import { OrbitDBNode, OrbitDBNodeCommands } from '../orbitdb/index.js';
import { INodesManager, OrbitDBTypes } from '../../models/index.js';
import { INodeActionResponse, INodeConfig } from '../../models/node.js';
import { IOpenDBOptions } from '../../models/orbitdb.js';
import { OpenDBCommands } from './commands.js';



class OpenDbManager implements INodesManager{
    public instances: Map<string, typeof Database> = new Map<string, typeof Database>()

    public constructor() {
        console.log('OpenDbManager created')
    }

    private set(
        db: typeof Database,
        isNewDb: boolean = false
    ) {
        let returnMsg: INodeActionResponse = {
            code: 300,
            message: `Database ${db.address.root} added`
        }

        if (this.instances.has(db.address.root) && !isNewDb) {
            returnMsg = {
                code: 300,
                message: `Database ${db.address.root} updated`
            }
        }
        else if (this.instances.has(db.address.root) && isNewDb) {
            return {
                code: 302,
                message: `Database ${db.address.root} already exists`,
                error: new Error(`Database ${db.address.root} not added`)
            }
        }
        else if (!this.instances.has(db.address.root) && isNewDb) {
            returnMsg = {
                code: 300,
                message: `Database ${db.address.root} created and added`
            }
        }

        this.instances.set(db.address.root, db)
        return returnMsg
    }
    

    public create(
        config: IOpenDBOptions
    ): INodeActionResponse {
        let responseMsg: INodeActionResponse = {
            code: 300,
            message: `Database ${config.databaseName} created`
        }

        config.orbitDBWorker.runCommand(
            OrbitDBNodeCommands.OPEN,
            [config.databaseName, config.databaseType]
        ).then((response) => {
            this.set(response, true)
            return responseMsg
        });

        return {
            code: 302,
            message: `Database ${config.databaseName} failed to create`,
            error: new Error(`Database ${config.databaseName} not created`)
        }
    }

    public add(
        db: typeof Database
    ): INodeActionResponse {
        return this.set(db, false)
    }

    public list(): string[] {
        let dbs: string[] = []
        this.instances.forEach((db) => {
            dbs.push(db.address.root)
        })
        return dbs
    }

    public get(
        id: string
    ): typeof Database | INodeActionResponse {
        const db = this.instances.get(id)

        if (db) {
            return db
        }

        return {
            code: 404,
            message: `Database ${id} not found`
        }
    }

    public delete(
        id: string
    ): INodeActionResponse {
        if (this.instances.has(id)) {
            this.instances.delete(id)
            return {
                code: 300,
                message: `Database ${id} deleted`
            }
        }

        return {
            code: 404,
            message: `Database ${id} not found`
        }
    }
}

export {
    OpenDbManager
}