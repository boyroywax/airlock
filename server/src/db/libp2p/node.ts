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
    public id: string;
    public instance: Libp2p;

    public constructor({
        id,
        options,
        instance
    }: Libp2pNodeConfig = new Libp2pNodeConfig()) {
        let passedInstance: Libp2p | undefined = undefined;
        if (!instance || instance === null || instance === undefined) {
            createLibp2p(options as Libp2pOptions).then((libp2p) => {
                passedInstance = libp2p;
            });
        }
        else if (instance) {
            passedInstance = instance;
        }
        else {
            throw new Error('Libp2p Node failed to initialize');
            
        }

        this.instance = passedInstance as Libp2p;
        this.id = id || createRandomId();
    }

    public getWorkerID(): string {
        return this.id;
    }

    public getPeerID(): string {
        return this.instance.peerId.toString();
    }
    
    public getInstance(): Libp2p<ServiceMap> {
        return this.instance;
    }

    public getStatus(): INodeActionResponse {
        const status: Libp2pStatus = this.instance.status
        return {
            code: 100,
            message: status.toString()
        } as INodeActionResponse
    }

    public async start(): Promise<INodeActionResponse> {
        let response: INodeActionResponse
        try {
            await this.instance.start()
            response = {
                code: 100,
                message: 'Libp2p Node started'
            }
        } catch (error: any) {
            response = {
                code: 104,
                message: 'Libp2p Node failed to start',
                error: error
            }
        }
        return response
    }

    public async stop(): Promise<INodeActionResponse> {
        let response: INodeActionResponse
        try {
            await this.instance.stop()
            response = {
                code: 100,
                message: 'Libp2p Node stopped'
            }
        } catch (error: any) {
            response = {
                code: 104,
                message: 'Libp2p Node failed to stop',
                error: error
            }
        }
        return response
    }
}

export {
    Libp2pNode,
    Libp2pNodeConfig
}