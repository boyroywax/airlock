import { Libp2p, Libp2pOptions, createLibp2p } from 'libp2p'
import { defaultLibp2pConfig } from './publicConfigDefault.js'
import { INodeConfig, INode, INodeActionResponse } from '../../models/index.js'
import { createRandomId } from '../../utils/index.js';


class Libp2pNode implements INode {

    public id: string;
    public instance: Libp2p;

    public constructor({
        id,
        options,
        instance
    }: INodeConfig = {
        id: createRandomId(),
        options: defaultLibp2pConfig,
        instance: null
    }) {
        if (!id) {
            id = createRandomId()
        }
        this.id = id;

        if (!instance) {
            const createNewLibp2p = async () => {
                instance = await createLibp2p(options as Libp2pOptions);
            };
            createNewLibp2p();

            if (!instance) {
                throw new Error('Libp2p instance not created');
            }
        }
        this.instance = instance;
    }

    public getID(): string {
        return this.id;
    }
    
    public getInstance(): Libp2p {
        return this.instance;
    }

    public async getStatus(): Promise<INodeActionResponse> {
        const status = this.instance.status
        return {
            code: 100,
            message: status.toString()
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
    Libp2pNode
}