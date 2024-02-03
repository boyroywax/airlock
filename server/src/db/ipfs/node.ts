import { createHelia, Helia } from 'helia';
import { MemoryBlockstore } from 'blockstore-core';
import { MemoryDatastore } from 'datastore-core';

import { Libp2pNode } from '../libp2p/node.js';
import { INode, INodeActionResponse, INodeConfig } from '../../models/node.js';
import { HeliaNodeOptions } from '../../models/helia.js';
import { createRandomId } from '../../utils/index.js';
import { create } from 'domain';





const verifyLibp2pNode = (libp2pWorker?: Libp2pNode | Libp2pNode['id']): Libp2pNode['id'] | INodeActionResponse => {
    if (libp2pWorker instanceof Libp2pNode) {
        return libp2pWorker.getWorkerID();
    }
    else if (typeof libp2pWorker === 'string') {
        return libp2pWorker;
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
    public options: HeliaNodeOptions;
    public id?: string;
    public instance?: Helia;

    public constructor(
        id: string = createRandomId(),
        options: HeliaNodeOptions = {
            blockstore: new MemoryBlockstore(),
            datastore: new MemoryDatastore(),
            libp2p: undefined,
        } as HeliaNodeOptions,
        instance?: Helia
    ) {
        this.id = id;
        this.options = options;
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
    }: HeliaConfig = new HeliaConfig()) {
        if (options.libp2p && options.libp2p instanceof Libp2pNode) {
            this.libp2pWorkerID = verifyLibp2pNode(options.libp2p);
            createHelia({
                libp2p: options.libp2p.getInstance(),
                blockstore: options.blockstore,
                datastore: options.datastore
            }).then((helia) => {
                this.instance = helia;
            });
        }
        else if ()
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

    public getLibp2pWorkerID(): string {
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