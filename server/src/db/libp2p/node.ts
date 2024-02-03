import { Libp2pStatus, ServiceMap } from '@libp2p/interface';
import { Libp2p, Libp2pOptions, createLibp2p } from 'libp2p';

import { defaultLibp2pConfig } from './publicConfigDefault.js';
import { INodeConfig, INode, INodeActionResponse } from '../../models/index.js';
import { createRandomId } from '../../utils/index.js';

class Libp2pNodeConfig implements INodeConfig {
    public id: string;
    public options?: Libp2pOptions;
    public instance?: Libp2p;

    public constructor(
        id: string = createRandomId(),
        options: Libp2pOptions = defaultLibp2pConfig,
        instance?: Libp2p
    ) {
        this.id = id;
        this.options = options;
        this.instance = instance;
    }
}


class Libp2pNode implements INode {
    public id: string = createRandomId();
    public instance: Libp2p;

    public constructor({
        id,
        options,
        instance
    }: Libp2pNodeConfig = new Libp2pNodeConfig()) {
        if (!instance || instance === null || instance === undefined) {
            createLibp2p(options as Libp2pOptions).then((libp2p) => {
                this.instance = libp2p;
            });
        }
        this.instance = instance ? instance : "No instance provided" as unknown as Libp2p;
        this.id = id || createRandomId();

    }

    public getID(): string {
        return this.id;
    }
    
    public getInstance(): Libp2p<ServiceMap> {
        return this.instance;
    }

    public getStatus(): INodeActionResponse {
        const status: Libp2pStatus = this.instance.status
        return {
            code: 100,
            message: status
        } as INodeActionResponse
    }

    public async start(): Promise<INodeActionResponse> {
        await this.instance.start()
        return {
            code: 100,
            message: 'Libp2p Node started'
        } as INodeActionResponse
    }

    public async stop(): Promise<INodeActionResponse> {
        await this.instance.stop()
        return {
            code: 100,
            message: 'Libp2p Node stopped'
        } as INodeActionResponse
    }
}

export {
    Libp2pNode,
    Libp2pNodeConfig
}