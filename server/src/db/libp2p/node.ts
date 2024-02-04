import { Libp2pStatus, ServiceMap } from '@libp2p/interface';
import { Libp2p, Libp2pOptions, createLibp2p } from 'libp2p';

import { defaultLibp2pConfig } from './publicConfigDefault.js';
import { INodeConfig, INode, INodeActionResponse } from '../../models/index.js';
import { createRandomId } from '../../utils/index.js';
import { create } from 'domain';

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
    public id: string; // @ts-ignore
    public instance: Libp2p;

    public constructor({
        id,
        options,
        instance
    }: Libp2pNodeConfig = new Libp2pNodeConfig()) {

        if ( !options ) {
            options = defaultLibp2pConfig;
        }

        const newInstance = async (options: Libp2pOptions ) => {
            this.instance = await createLibp2p(options)
        }

        if ( !instance ) {
            newInstance(options)
        }
        else {
            this.instance = instance;
        }

        if ( !id ) {
            this.id = createRandomId();
        }
        else {
            this.id = id;
        }
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
        const status = this.instance.status
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
                message: `Libp2p ${this.id} Node stopped`
            }
        } catch (error: any) {
            response = {
                code: 104,
                message: `Libp2p ${this.id} Node failed to stop`,
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