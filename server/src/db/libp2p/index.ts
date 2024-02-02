import { Libp2p, Libp2pOptions, createLibp2p  } from 'libp2p'
import { defaultLibp2pConfig } from './publicConfigDefault.js'
import { ILibp2pInstanceOptions } from '../../models/libp2pModels.js'


class Libp2pInstance {
    public id: string;
    public instance: Libp2p;

    public constructor(
        id: string | null = null,
        libp2pConfig: ILibp2pInstanceOptions = defaultLibp2pConfig,
        instance: Libp2p | null = null
    ) {
        if (!id) {
            id = Math.random().toString(36).substring(7);
        }
        this.id = id;

        if (!instance) {
            const createNewLibp2pInstance = async () => {
                instance = await createLibp2p(libp2pConfig as Libp2pOptions);
            };
            createNewLibp2pInstance();

            if (!instance) {
                throw new Error('Libp2p instance not created');
            }
        }
        this.instance = instance;
    }
}

class Libp2pInstanceManager {
    public instances: Map<string, Libp2pInstance> = new Map<string, Libp2pInstance>()

    public createLibp2pInstance(
        id: string | null = null,
        libp2pConfig: Libp2pInstanceOptions | null = null
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

let libp2pManager = new Libp2pInstanceManager();


export {
    libp2pManager,
    Libp2pInstance,
    Libp2pInstanceManager
}