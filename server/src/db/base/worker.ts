import {
    Libp2p,
    Libp2pOptions,
    createLibp2p
} from 'libp2p';

import {
    defaultLibp2pConfig
} from '../publicConfigDefault.js';

import {
    Helia,
    createHelia
} from 'helia';

import {
    MemoryBlockstore
} from 'blockstore-core'

import {
    MemoryDatastore
} from 'datastore-core'

import {
    createOrbitDb,
    useIdentityProvider,
    OrbitDb
} from '@orbitdb/core';

import OrbitDBIdentityProviderDID from '@orbitdb/identity-provider-did'
import KeyDidResolver from 'key-did-resolver'
import {
    Ed25519Provider
} from 'key-did-provider-ed25519'

import {
    logger
} from '../../utils/index.js';

import {
    Component,
    LogLevel
} from '../../models';


/**
 * @interface IBaseWorkerOptions
 * @description Base Worker Options Interface
 * @member options: any
 */
interface IBaseWorkerOptions {
    options?: any;
}


/**
 * @class IPFSWorkerOptions
 * @description IPFS Worker Options
 * @implements IBaseWorkerOptions
 * @member options: any
 * @method constructor(options: any): void
 * @param blockstore: any
 * @param datastore: any
 * @param libp2p: Libp2p
 */
class IPFSWorkerOptions 
    implements IBaseWorkerOptions
{
    public options: any;

    public constructor({
        blockstore,
        datastore,
        libp2p,
    } : {
        blockstore?: MemoryBlockstore | any,
        datastore?: MemoryDatastore | any,
        libp2p: Libp2p,
    }) {
        this.options = {
            blockstore: blockstore ? blockstore : new MemoryBlockstore(),
            datastore: datastore ? datastore : new MemoryDatastore(),
            libp2p: libp2p
        };
    }
}


class OrbitDbWorkerOptions
    implements IBaseWorkerOptions
{
    public options: any;

    public constructor({
        ipfs,
        enableDID,
        identitySeed
    } : {
        ipfs: Helia,
        enableDID?: boolean,
        identitySeed?: Uint8Array

    }) {
        if (!identitySeed) {
            identitySeed = new Uint8Array([157, 94, 116, 1918, 1239, 238, 91, 229, 173, 82, 245, 222, 199, 7, 183, 177, 123, 238, 83, 240, 143, 188, 87, 191, 33, 95, 58, 136, 46, 218, 219, 245])
        }

        if (enableDID) {
            OrbitDBIdentityProviderDID.setDIDResolver(KeyDidResolver.getResolver())
            useIdentityProvider(OrbitDBIdentityProviderDID)
            const didProvider = new Ed25519Provider(identitySeed)
            const provider = OrbitDBIdentityProviderDID({ didProvider })

            this.options = {
                ipfs: ipfs,
                identity: { provider }
            }
        }
        else {
            this.options = {
                ipfs: ipfs
            }
        }
    }
}


/**
 * @class DefaultWorkerOptions
 * @description Default Worker Options
 * @implements IBaseWorkerOptions
 * @member options: any
 * @method constructor(type: Component): void
 */
class DefaultWorkerOptions
    implements IBaseWorkerOptions
{
    public options: Libp2pOptions | IPFSWorkerOptions | any;

    public constructor({
        type,
        condition,
        enableDID,
        identitySeed
    } : {
        type: Component,
        condition?: Libp2p | Helia | typeof OrbitDb
        enableDID?: boolean,
        identitySeed?: Uint8Array
    }) {
        switch (type) {
            case Component.LIBP2P:
                this.options = defaultLibp2pConfig;
                break;
            case Component.IPFS:
                this.options = new IPFSWorkerOptions({libp2p: condition})
                break;
            case Component.ORBITDB:
                this.options = new OrbitDbWorkerOptions({
                    ipfs: condition,
                    enableDID: enableDID ? enableDID : true,
                    identitySeed: identitySeed
                });
                break;
            default:
                logger({
                    level: LogLevel.ERROR,
                    message: '[DefaultWorkerOptions] Unknown worker type'
                });
                this.options = {} as any;
        }
    }
}


/**
 * @interface IBaseWorker
 * @description Base Worker Interface
 * @member worker: T
 * @member options: U
 * @method createWorker: (options?: U) => Promise<T>
 */
interface IBaseWorker
{
    type: Component;
    worker?: Libp2p | Helia | typeof OrbitDb | any;
    options?: IBaseWorkerOptions;

    createWorker: (
        options: IBaseWorkerOptions
    ) => Promise<any>;
}


/**
 * @class BaseWorker
 * @description Base Worker
 * @implements IBaseWorker
 * @member worker: T
 * @member options: U
 * @method createWorker: (options?: U) => Promise<T>
 */
class BaseWorker
    implements IBaseWorker
{
    public type: Component;
    public worker?: Libp2p | Helia | typeof OrbitDb | any;
    public options?: IBaseWorkerOptions;

    public constructor(
        type: Component,
        worker?: Libp2p | Helia | typeof OrbitDb | any,
        options?: IBaseWorkerOptions
    ) {
        this.type = type;
        this.worker = worker

        if (!options) {
            this.options = new DefaultWorkerOptions({ type });
        }
        else {
            this.options = options;
        }

        if (!this.worker) {
            this.createWorker(this.options)
                .then( (worker) => {
                    this.worker = worker;
                })
                .catch( (error: Error) => {
                    console.log('Error creating worker', error);
                }
            );
        }
    }

    public createWorker = async (options: IBaseWorkerOptions): Promise<any> => {
        let worker = {} as any;

        switch (this.type) {
            case Component.LIBP2P:
                worker = await createLibp2p(options.options);
                break;
            case Component.IPFS:
                worker = await createHelia(options.options);
                break;
            case Component.ORBITDB:
                worker = await createOrbitDb(options.options);
                break;
            default:
                logger({
                    level: LogLevel.ERROR,
                    message: '[BaseWorker] Unknown worker type'
                });
        }

        logger({
            level: LogLevel.INFO,
            message: `[BaseWorker] Worker created: ${this.type}`
        
        })

        return worker;
    }
}


export {
    IBaseWorker,
    BaseWorker,
    IBaseWorkerOptions,
    IPFSWorkerOptions,
    DefaultWorkerOptions
}