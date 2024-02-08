import { Database } from '@orbitdb/core';

import { OrbitDBNode, OrbitDBNodeCommands, OrbitDBNodesManager } from '../orbitdb/index.js';
import { INodesManager, OrbitDBTypes } from '../../models/index.js';
import { INodeActionResponse, INodeConfig, INodeCommandResponse } from '../../models/node.js';
import { IOpenDBOptions } from '../../models/orbitdb.js';
import { OpenDB, OpenDBConfig } from './node.js';



class OpenDbManager implements INodesManager{
    private orbitDbManager: OrbitDBNodesManager;
    public instances: Map<string, OpenDB> = new Map<string, OpenDB>()

    public constructor(orbitDbNodeManager: OrbitDBNodesManager) {
        this.orbitDbManager = orbitDbNodeManager;
        console.log('OpenDbManager created')
    }

    private set(
        db: OpenDB,
        isNewDb: boolean = false
    ) {
        let returnMsg: INodeActionResponse = {
            code: 300,
            message: `Database ${db.id} added`
        }

        if (this.instances.has(db.id) && !isNewDb) {
            returnMsg = {
                code: 300,
                message: `Database ${db.id} updated`
            }
        }
        else if (this.instances.has(db.id) && isNewDb) {
            return {
                code: 302,
                message: `Database ${db.id} already exists`,
                error: new Error(`Database ${db.id} not added`)
            }
        }
        else if (!this.instances.has(db.id) && isNewDb) {
            returnMsg = {
                code: 300,
                message: `Database ${db.id} created and added`
            }
        }

        this.instances.set(db.id, db)
        return returnMsg
    }

    private getOrbitDbNode(
        id: string
    ): OrbitDBNode {
        if (this.orbitDbManager.instances.has(id)) {
            return this.orbitDbManager.instances.get(id) as OrbitDBNode
        }
        else {
            throw new Error(`OrbitDB Node ${id} not found`)
        }
    }

    

    public create(
        config: OpenDBConfig
    ): INodeActionResponse {
        let responseMsg: INodeActionResponse = {
            code: 300,
            message: `Database ${config.id} created`
        }
        const activeOrbitdbNode = this.getOrbitDbNode(config.options.orbitDbWorkerId)

        activeOrbitdbNode.runCommand({
            command: OrbitDBNodeCommands.OPEN,
            args: config.options as IOpenDBOptions
        }).then((response) => {
            try {
                responseMsg = this.set(new OpenDB({
                    id: config.id,
                    options: config.options,
                    instance: response
                }), true)
            }
            catch (error: any) {
                responseMsg = {
                    code: 302,
                    message: `Database ${config.id} failed to create`,
                    error: error
                }
            }
        });

        return responseMsg
    }

    public add(
        db: typeof Database
    ): INodeActionResponse {
        return this.set(db, false)
    }

    public list(): string[] {
        let dbs: string[] = []
        this.instances.forEach((db) => {
            dbs.push(db.instance.id)
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