import { OrbitDB } from '@orbitdb/core';

import { INodesManager, INodeActionResponse } from '../../models/index.js';
import { OrbitDBNode, OrbitDBNodeConfig } from './node.js';


class OrbitDBNodesManager implements INodesManager {
    public instances: Map<string, OrbitDBNode> = new Map<string, OrbitDBNode>()

    public constructor(
        config: OrbitDBNodeConfig[] = []
    ) {
        console.log(config)             // debug
        config.forEach((orbitDbNodeConfig) => {
            this.create(orbitDbNodeConfig)
        })
    }

    private set(
        orbitDb: OrbitDBNode,
        isNewNode: boolean = false
    ) {
        let returnMsg: INodeActionResponse = {
            code: 300,
            message: `OrbitDB Node ${orbitDb.id} added`
        }

        if (this.instances.has(orbitDb.id) && !isNewNode) {
            returnMsg = {
                code: 300,
                message: `OrbitDB Node ${orbitDb.id} updated`
            }
        }
        else if (this.instances.has(orbitDb.id) && isNewNode) {
            return {
                code: 302,
                message: `OrbitDB Node ${orbitDb.id} already exists`,
                error: new Error(`OrbitDB Node ${orbitDb.id} not added`)
            }
        }
        else if (!this.instances.has(orbitDb.id) && isNewNode) {
            returnMsg = {
                code: 300,
                message: `OrbitDB Node ${orbitDb.id} created and added`
            }
        }

        this.instances.set(orbitDb.id, orbitDb)
        return returnMsg
    }

    public create(
        config: OrbitDBNodeConfig
    ): INodeActionResponse {
        const newOrbitDb = new OrbitDBNode(config)

        return this.set(newOrbitDb, true)
    }

    public add(
        orbitDb: OrbitDBNode
    ): INodeActionResponse {
        return this.set(orbitDb, false)
    }

    public list(): string[] {
        let orbitDbs: string[] = []
        this.instances.forEach((orbitDb) => {
            orbitDbs.push(orbitDb.id)
        })
        return orbitDbs
    }

    public get(
        id: OrbitDBNode['id']
    ): OrbitDBNode | INodeActionResponse {
        const orbitDb = this.instances.get(id)

        if (orbitDb) {
            return orbitDb
        }
        else {
            return {
                code: 302,
                message: `OrbitDB Node ${id} not found`,
                error: new Error(`OrbitDB Node ${id} not found`)
            }
        }
    }

    public delete(
        id: OrbitDBNode['id']
    ): INodeActionResponse {
        if (this.instances.has(id)) {
            this.instances.delete(id)
            return {
                code: 300,
                message: `OrbitDB Node ${id} deleted`
            }
        }
        else {
            return {
                code: 302,
                message: `OrbitDB Node ${id} not found`,
                error: new Error(`OrbitDB Node ${id} not found`)
            }
        }
    }
}

/**
 * @function createOrbitDBNodeManager
 * @param config
 * @returns OrbitDBNodeManager
 * @description Creates a new OrbitDBNodeManager instance
 * @summary This function creates a new OrbitDBNodeManager instance
 *         and returns it
 */
function createOrbitDBNodesManager(
    config: OrbitDBNodeConfig[] = []
): OrbitDBNodesManager {
    return new OrbitDBNodesManager(config)
}

export {
    createOrbitDBNodesManager,
    OrbitDBNodesManager
}