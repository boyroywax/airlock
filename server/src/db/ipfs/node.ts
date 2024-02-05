import { createHelia, Helia } from 'helia';
import { MemoryBlockstore } from 'blockstore-core';
import { MemoryDatastore } from 'datastore-core';

import { Libp2pNode } from '../libp2p/node.js';
import { INode, INodeActionResponse, INodeConfig } from '../../models/node.js';
import { IHeliaNodeOptions } from '../../models/helia.js';
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
    public options: IHeliaNodeOptions;
    public instance?: Helia;

    public constructor(
        id: string = createRandomId(),
        options: IHeliaNodeOptions,
        instance?: Helia
    ) {
        this.id = id;
        
        let ipfsNodeOptions: IHeliaNodeOptions | undefined = undefined;

        if (options?.libp2p && options?.blockstore && options?.datastore) {
            ipfsNodeOptions = options;
        }
        else if (options?.libp2p && !options?.blockstore && !options?.datastore) {
            ipfsNodeOptions = {
                blockstore: new MemoryBlockstore(),
                datastore: new MemoryDatastore(),
                libp2p: options.libp2p
            }
        }
        else if (!options?.libp2p) {
            throw new Error("Invalid Libp2p Worker");
        }

        this.options = ipfsNodeOptions as IHeliaNodeOptions;

        this.instance = instance;
    }
}


class IPFSNode implements INode {
    public id: string;
    public instance: Helia;
    public libp2pWorkerId: Libp2pNode['id'] | INodeActionResponse;
    public status: INodeActionResponse;

    public constructor({
        id,
        options,
        instance
    }: HeliaConfig) {
        this.id = id ? id: createRandomId();

        this.status = {
            code: 200,
            message: `IPFS Node ${this.id} creation started...`
        } as INodeActionResponse;

        this.libp2pWorkerId = verifyLibp2pNode(options.libp2p);

        let heliaInstance: IPFSNode['instance'] | undefined = undefined;

        if (instance) {
            heliaInstance = instance;
        }
        
        if ((!instance || instance === null || instance === undefined) &&
            options.blockstore && options.datastore && options.libp2p
        ) {
            this.status = {
                code: 200,
                message: `IPFS Node ${this.id} Helia creation started...`
            } as INodeActionResponse;

            createHelia({
                blockstore: options.blockstore as MemoryBlockstore,
                datastore: options.datastore as MemoryDatastore,
                libp2p: options.libp2p.getInstance()
            }).then((helia) => {
                heliaInstance = helia;

                this.status = {
                    code: 200,
                    message: `IPFS Node ${this.id} Helia created`
                } as INodeActionResponse;

            });
        }

        this.instance = heliaInstance as Helia;

        this.status = {
            code: 200,
            message: `IPFS Node ${this.id} creation completed`
        } as INodeActionResponse;
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
        return this.libp2pWorkerId;
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
                message: `IPFS Node ${this.id} Started`
            }
        } catch (error: any) {
            response = {
                code: 202,
                message: `IPFS Node ${this.id} Failed to Start`,
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