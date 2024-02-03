
import { INodesManager, INodeActionResponse, INodeConfig, INode } from '../../models/index.js'
import { Libp2pNode, Libp2pNodeConfig } from './node.js';

class Libp2pNodesManager implements INodesManager{
    public instances: Map<string, Libp2pNode> = new Map<string, Libp2pNode>()

    public constructor(
        config: Libp2pNodeConfig[] = [new Libp2pNodeConfig()]
    ) {
        console.log(config)                // debug
        config.forEach((libp2pNodeConfig) => {
            this.create(libp2pNodeConfig)
        })
    }

    private set(
        libp2pNode: Libp2pNode,
        isNewNode: boolean = false
    ) {
        let returnMsg: INodeActionResponse = {
            code: 100,
            message: `Libp2p Node ${libp2pNode.id} added`
        }

        if (this.instances.has(libp2pNode.id) && !isNewNode) {
            returnMsg = {
                code: 100,
                message: `Libp2p Node ${libp2pNode.id} updated`
            }
        }
        else if (this.instances.has(libp2pNode.id) && isNewNode) {
            return {
                code: 100,
                message: `Libp2p Node ${libp2pNode.id} already exists`,
                error: new Error(`Libp2p Node ${libp2pNode.id} not added`)
            }
        }
        else if (!this.instances.has(libp2pNode.id) && isNewNode) {
            returnMsg = {
                code: 100,
                message: `Libp2p Node ${libp2pNode.id} created and added`
            }
        }

        this.instances.set(libp2pNode.id, libp2pNode)
        return returnMsg
    }

    public create(
        config: Libp2pNodeConfig 
    ): INodeActionResponse {
        const newLibp2pNode = new Libp2pNode(config)

        return this.set(newLibp2pNode, true)
    }

    public add(libp2pNode: Libp2pNode): INodeActionResponse {
        return this.set(libp2pNode, false)
    }

    public list(): INode[] {
        let libp2ps: Libp2pNode[] = []
        for (let [id] of this.instances) {
            console.log(id)                // debug
            libp2ps.push(this.instances.get(id) as Libp2pNode)
        }
        return libp2ps
    }

    public get(
        id: string
    ): Libp2pNode | INodeActionResponse  {
        const libp2p: Libp2pNode | undefined = this.instances.get(id)
        if (!libp2p === undefined) {
            return {
                code: 100,
                message: `Libp2p Node ${id} not found`,
                error: new Error(`Libp2p Node ${id} not found`)
            } as INodeActionResponse
        }
        return libp2p as Libp2pNode
        
    }

    public delete(id: string) {
        const success = this.instances.delete(id)
        if (!success) {
            return {
                code: 100,
                message: `Libp2p Node ${id} not found`,
                error: new Error(`Libp2p Node ${id} not found`)
            }
        }
        return {
            code: 100,
            message: `Libp2p Node ${id} deleted`
        }
    }
}


function createLibp2pManager(
    libp2pOptions: Libp2pNodeConfig[] = [new Libp2pNodeConfig()]
) {
    return new Libp2pNodesManager(libp2pOptions)
}

export {
    createLibp2pManager,
    Libp2pNodesManager
}