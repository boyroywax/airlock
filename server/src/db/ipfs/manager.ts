import { Helia } from "helia";

import { INodesManager, INodeActionResponse } from "../../models/index.js";
import { IPFSNode, HeliaConfig } from "./node.js";
import { HeliaNodeOptions } from "../../models/helia.js";
import { Libp2pNode } from "../libp2p/node.js";


class IPFSNodesManager implements INodesManager {
    public instances: Map<string, IPFSNode> = new Map<string, IPFSNode>()

    public constructor(
        config: HeliaConfig[] = []
    ) {
        console.log(config)                // debug
        config.forEach((heliaConfig) => {
            this.create(heliaConfig)
        })
    }

    private set(
        helia: IPFSNode,
        isNewNode: boolean = false
    ) {
        let returnMsg: INodeActionResponse = {
            code: 200,
            message: `IPFS Node ${helia.id} added`
        }

        if (this.instances.has(helia.id) && !isNewNode) {
            returnMsg = {
                code: 200,
                message: `IPFS Node ${helia.id} updated`
            }
        }
        else if (this.instances.has(helia.id) && isNewNode) {
            return {
                code: 202,
                message: `IPFS Node ${helia.id} already exists`,
                error: new Error(`IPFS Node ${helia.id} not added`)
            }
        }
        else if (!this.instances.has(helia.id) && isNewNode) {
            returnMsg = {
                code: 200,
                message: `IPFS Node ${helia.id} created and added`
            }
        }

        this.instances.set(helia.id, helia)
        return returnMsg
    }

    public create(
        config: HeliaConfig
    ): INodeActionResponse {
        const newHelia = new IPFSNode(config)

        return this.set(newHelia, true)
    }

    public add(helia: IPFSNode): INodeActionResponse {
        return this.set(helia, false)
    }

    public list(): string[] {
        let helias: string[] = []
        this.instances.forEach((helia) => {
            helias.push(helia.id)
        })
        return helias
    }

    public get(id: IPFSNode['id']): IPFSNode | INodeActionResponse {
        let ipfsNode: IPFSNode | undefined = this.instances.get(id)
        if (ipfsNode) {
            return ipfsNode
        }
        else {
            return {
                code: 202,
                message: `IPFS Node ${id} not found`,
                error: new Error(`IPFS Node ${id} not found`)
            } as INodeActionResponse
        }
    }
    
    public delete(id: IPFSNode['id']): INodeActionResponse {
        if (this.instances.has(id)) {
            this.instances.delete(id)
            return {
                code: 200,
                message: `IPFS Node ${id} deleted`
            }
        }
        else {
            return {
                code: 202,
                message: `IPFS Node ${id} not found`,
                error: new Error(`IPFS Node ${id} not found`)
            }
        }
    }
}

/**
 * @function createIPFSNodesManager
 * @param config  : HeliaConfig[] = []
 * @returns IPFSNodesManager
 * @description Creates a new IPFSNodesManager instance
 * @summary If no HeliaConfig is provided, the manager will be created without any IPFS Nodes.
 *          Otherwise, the manager will be created with the provided IPFS Nodes
 */
function createIPFSNodesManager(
    config: HeliaConfig[] = []
): IPFSNodesManager {
    return new IPFSNodesManager(config)
}

export {
    createIPFSNodesManager,
    IPFSNodesManager
}