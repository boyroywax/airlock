import { createHelia, Helia } from 'helia';
import { MemoryBlockstore } from 'blockstore-core';
import { MemoryDatastore } from 'datastore-core';

import { Libp2pNode } from '../libp2p/node.js';
import { INode, INodeActionResponse, INodeConfig } from '../../models/node.js';
import { HeliaNodeOptions } from '../../models/helia.js';
import { createRandomId } from '../../utils/index.js';


const verifyLibp2pNode = (libp2p?: Libp2pNode): Libp2pNode => {
    if (libp2p?.instance) {
        return libp2p;
    }
    return new Libp2pNode();
}


class HeliaNodeConfig implements INodeConfig {
    public options: HeliaNodeOptions;
    public id?: string;
    public instance?: Helia;

    public constructor(
        id: string = createRandomId(),
        options: HeliaNodeOptions = {
            blockstore: new MemoryBlockstore(),
            datastore: new MemoryDatastore(),
            libp2p: verifyLibp2pNode(),
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
    public libp2pWorkerID: string;

    public constructor({
        id,
        options,
        instance
    }: HeliaNodeConfig = new HeliaNodeConfig()) {
        if (!instance || instance === null || instance === undefined) {
            createHelia({
                libp2p: options.libp2p.getInstance(),
                blockstore: options.blockstore,
                datastore: options.datastore
            }).then((helia) => {
                this.instance = helia;
            });
        }
        this.instance = instance ? instance : "No instance provided" as unknown as Helia;
        this.id = id || createRandomId();
        this.libp2pWorkerID = options.libp2p.getWorkerID();
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
                code: 201,
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
                code: 201,
                message: "IPFS Node Failed to Stop",
                error: error
            }
        }
        return response
    }
}