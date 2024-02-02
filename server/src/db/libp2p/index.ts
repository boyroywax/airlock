import { Libp2p, Libp2pOptions, createLibp2p  } from 'libp2p'
import { defaultLibp2pConfig } from './publicConfigDefault.js'
import { INodeInstanceConfig, INodeInstance, INodeInstancesManager, INodeActionResponse } from '../../models/node.js'
import { createRandomId } from '../../utils/index.js';


class Libp2pNode implements INodeInstance {

    public id: string;
    public instance: Libp2p;

    public constructor({
        id,
        options,
        instance
    }: INodeInstanceConfig = {
        id: createRandomId(),
        options: defaultLibp2pConfig,
        instance: null
    }) {
        if (!id) {
            id = createRandomId()
        }
        this.id = id;

        if (!instance) {
            const createNewLibp2pInstance = async () => {
                instance = await createLibp2p(options as Libp2pOptions);
            };
            createNewLibp2pInstance();

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

class Libp2pInstanceManager implements INodeInstancesManager{
    public instances: Map<string, Libp2pInstance> = new Map<string, Libp2pInstance>()

    public constructor(
        libp2pInstanceOptions: ILibp2pInstanceOptions[] = []
    ) {
        for (let i = 0; i < libp2pInstanceOptions.length; i++) {
            if (!libp2pInstanceOptions[i].instance) {
                this.createLibp2pInstance()
            }
            else if (libp2pInstanceOptions[i].instance) {
                this.addLibp2pInstance(libp2pInstanceOptions[i].instance)
            }
        }
    }

    public createLibp2pInstance(
    ) {
        const newInstance = new Libp2pInstance()
        this.instances.set(newInstance.id, newInstance)
    }

    public addLibp2pInstance(libp2pInstance: Libp2pInstance) {
        this.instances.set(libp2pInstance.id, libp2pInstance)
    }

    public listLibp2pInstances(): string[] {
        let libp2pInstances: string[] = []
        for (let [id] of this.instances) {
            console.log(id)                // debug
            libp2pInstances.push(id)
        }
        return libp2pInstances
    }

    public getLibp2pInstance(
        id: string
    ): Libp2pInstance | Error  {
        const libp2pInstance: Libp2pInstance | undefined = this.instances.get(id)
        if (!libp2pInstance === undefined) {
            return new Error(`Libp2p Node ${id} not found`)
        }
        return libp2pInstance as Libp2pInstance
        
    }

    public deleteLibp2pNode(id: string) {
        this.instances.delete(id)
        return {
            message: `Libp2p Node ${id} deleted`
        }
    }
}


function createLibp2pManager(
    ILibp2pInstanceOptions: ILibp2pInstanceOptions[] = []
) {
    return new Libp2pInstanceManager(ILibp2pInstanceOptions)
}

export {
    libp2pManager,
    Libp2pInstance,
    Libp2pInstanceManager
}