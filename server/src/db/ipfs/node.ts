import { createHelia, Helia } from 'helia';
import { MemoryBlockstore } from 'blockstore-core';
import { MemoryDatastore } from 'datastore-core';

import { Libp2pNode } from '../libp2p/node.js';
import { INode, INodeActionResponse, INodeConfig } from '../../models/node.js';
import { HeliaNodeOptions } from '../../models/helia.js';
import { createRandomId } from '../../utils/index.js';


const verifyLibp2pNode = (libp2pWorker: Libp2pNode ): Libp2pNode['id'] | INodeActionResponse => {
    const workerId: string = libp2pWorker.getWorkerID();
    if (workerId && workerId !== null && workerId !== undefined) {
        return workerId;
    }
    else {
        return {
            code: 202,
            message: "Invalid Libp2p Worker",
            error: new Error("Invalid Libp2p Worker")
        };
    }
}


class HeliaConfig implements INodeConfig {
    public id: string;
    public options: HeliaNodeOptions;
    public instance?: Helia;

    public constructor(
        id: string = createRandomId(),
        options?: HeliaNodeOptions,
        instance?: Helia
    ) {
        this.id = id;
        this.options = {
            blockstore: new MemoryBlockstore(),
            datastore: new MemoryDatastore(),
            libp2p: new Libp2pNode()
        } as HeliaNodeOptions;
        this.instance = instance;
    }
}


class IPFSNode implements INode {
    public id: string;
    public instance: Helia;
    public libp2pWorkerID: Libp2pNode['id'] | INodeActionResponse;

    public constructor({
        id,
        options,
        instance
    }: HeliaConfig) {

        let heliaInstance: IPFSNode['instance'] | undefined = undefined;

        if (instance) {
            heliaInstance = instance;
        }
        
        if ((!instance || instance === null || instance === undefined) &&
            options.blockstore && options.datastore && options.libp2p
        ) {
            createHelia({
                blockstore: options.blockstore as MemoryBlockstore,
                datastore: options.datastore as MemoryDatastore,
                libp2p: options.libp2p.getInstance()
            }).then((helia) => {
                heliaInstance = helia;
            });
        }
 
        this.libp2pWorkerID = verifyLibp2pNode(options.libp2p);

        this.instance = heliaInstance as Helia;
  
        this.id = id ? id: createRandomId();
    }

    public getWorkerID(): string {
        return this.id;
    }

    public getPeerID(): string {
        return this.instance.libp2p.peerId.toString();
    }
    
    public getInstance(): Helia {
        return this.instance;
    }

    public getLibp2pWorkerID(): string | INodeActionResponse {
        return this.libp2pWorkerID;
    }

    public getStatus(): INodeActionResponse {
        return {
            code: 200,
            message: this.instance.libp2p.status.toString()
        } as INodeActionResponse
    }

    public async start(): Promise<INodeActionResponse> {
        let response: INodeActionResponse
        try {
            await this.instance.start();
            response = {
                code: 200,
                message: "IPFS Node Started"
            }
        } catch (error: any) {
            response = {
                code: 202,
                message: "IPFS Node Failed to Start",
                error: error
            }
        }
        return response
    }

    public async stop(): Promise<INodeActionResponse> {
        let response: INodeActionResponse
        try {
            await this.instance.stop();
            response = {
                code: 200,
                message: "IPFS Node Stopped"
            }
        } catch (error: any) {
            response = {
                code: 202,
                message: "IPFS Node Failed to Stop",
                error: error
            }
        }
        return response
    }
}

export {
    HeliaConfig,
    IPFSNode
}