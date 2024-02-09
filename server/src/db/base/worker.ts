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
    OrbitDb,
    Database
} from '@orbitdb/core';

import OrbitDBIdentityProviderDID from '@orbitdb/identity-provider-did'
import KeyDidResolver from 'key-did-resolver'
import {
    Ed25519Provider
} from 'key-did-provider-ed25519'

import {
    createRandomId,
    logger
} from '../../utils/index.js';

import {
    Component,
    LogLevel
} from '../../models';

import {
    BaseCommand
} from './commands.js';

type WorkerType = Libp2p | Helia | typeof OrbitDb | typeof Database;

type WorkerOptions = IWorkerOptions | OrbitDbWorkerOptions | DefaultWorkerOptions;

interface IWorkerOptions {
    libp2pOptions?: Libp2pOptions;
    libp2p?: Libp2p;
    ipfs?: Helia;
    blockstore?: any;
    datastore?: any;
    enableDID?: boolean;
    identitySeed?: Uint8Array;
    identityProvider?: typeof OrbitDBIdentityProviderDID;
    orbitdb?: typeof OrbitDb;
    databaseName?: string;
    databaseType?: string;
}

class DefaultWorkerOptions
    implements IWorkerOptions
{
    public libp2pOptions?: Libp2pOptions;
    public libp2p?: Libp2p;
    public ipfs?: Helia;
    public blockstore?: any;
    public datastore?: any;
    public enableDID?: boolean = true;
    public identitySeed?: Uint8Array;
    public identityProvider?: typeof OrbitDBIdentityProviderDID;
    public orbitdb?: typeof OrbitDb;
    public databaseName?: string;
    public databaseType?: string;

    public constructor(options?: IWorkerOptions) {
        options = options ? options : {} as IWorkerOptions;
        this.libp2pOptions = options.libp2pOptions ? options.libp2pOptions : defaultLibp2pConfig;
        this.libp2p = options.libp2p;
        this.ipfs = options.ipfs;
        this.blockstore = options.blockstore ? options.blockstore : new MemoryBlockstore();
        this.datastore = options.datastore ? options.datastore : new MemoryDatastore();
        this.enableDID = options.enableDID ? options.enableDID : true;
        this.identitySeed = options.identitySeed ? options.identitySeed : new Uint8Array([157, 94, 116, 1918, 1239, 238, 91, 229, 173, 82, 245, 222, 199, 7, 183, 177, 123, 238, 83, 240, 143, 188, 87, 191, 33, 95, 58, 136, 46, 218, 219, 245]);
        this.identityProvider = options.identityProvider ? options.identityProvider : OrbitDBIdentityProviderDID;
        this.orbitdb = options.orbitdb;
        this.databaseName = options.databaseName ? options.databaseName : createRandomId();
        this.databaseType = options.databaseType ? options.databaseType : 'events';
    }
}

class OrbitDbWorkerOptions
    extends DefaultWorkerOptions
    implements IWorkerOptions
{
    public constructor(options: IWorkerOptions) {
        super(options);

        if (this.enableDID) {
            if (!this.identitySeed) {
                logger({
                    level: LogLevel.WARN,
                    message: `[OrbitDbWorkerOptions] No identity seed provided, using default`
                });
                this.identitySeed = new Uint8Array([157, 94, 116, 1918, 1239, 238, 91, 229, 173, 82, 245, 222, 199, 7, 183, 177, 123, 238, 83, 240, 143, 188, 87, 191, 33, 95, 58, 136, 46, 218, 219, 245])
            }

            try {
                OrbitDBIdentityProviderDID.setDIDResolver(KeyDidResolver.getResolver())
                useIdentityProvider(OrbitDBIdentityProviderDID)
                const didProvider = new Ed25519Provider(this.identitySeed)
                this.identityProvider = OrbitDBIdentityProviderDID({ didProvider })
            } catch (error: any) {
                logger({
                    level: LogLevel.ERROR,
                    message: `[OrbitDbWorkerOptions] Error creating DID identity provider: ${error}`
                })
            }
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
    id: string;
    type: Component;
    worker?: WorkerType;
    options?: WorkerOptions;
    commands?: BaseCommand[];

    createWorker: (
        options: WorkerOptions
    ) => Promise<WorkerType>;

    createCommands: (
        commands: BaseCommand[]
    ) => Promise<BaseCommand[]>;
}


/**
 * @class BaseWorker
 * @description Base Worker
 * @implements IBaseWorker
 * @member worker: WorkerType
 * @member options: WorkerOptions
 * @member commands: BaseCommand[]
 * @method createWorker: (options: WorkerOptions) => Promise<WorkerType>
 * @method createCommands: (commands: BaseCommand[]) => Promise<BaseCommand[]>
 * @param type: Component - The type of worker
 * @param id?: string - The worker ID
 * @param process?: WorkerType - The worker process
 * @param options?: WorkerOptions - The worker options
 * @param commands?: BaseCommand[] - The worker commands
 * 
 */
class BaseWorker
    implements IBaseWorker
{
    public id: string;
    public type: Component;
    public process?: WorkerType;
    public options?: WorkerOptions;
    public commands?: BaseCommand[];

    public constructor(
        type: Component,
        id?: string,
        process?: WorkerType,
        options?: WorkerOptions
    ) {
        this.type = type;
        this.id = id ? id : createRandomId();
        this.process = process;
        this.options = options;

        if (!this.process) {
            this.createWorker(this.options)
                .then( (worker) => {
                    this.process = worker;
                })
                .catch( (error: Error) => {
                    
                    logger({
                        level: LogLevel.ERROR,
                        component: type,
                        message: `[BaseWorker] Error creating worker: ${error}`
                    });
                }
            );
        }
    }

    public createWorker = async (options?: WorkerOptions): Promise<WorkerType> => {
        let worker: WorkerType = null;
        options = this.options ? this.options :  new DefaultWorkerOptions(options);

        switch (this.type) {
            case Component.LIBP2P:
                worker = await createLibp2p({

                });
                break;
        
            case Component.IPFS:
                if (!options?.libp2p) {
                    logger({
                        level: LogLevel.ERROR,
                        component: Component.IPFS,
                        message: '[BaseWorker] No libp2p instance provided'
                    });
                }
                else {
                    worker = await createHelia({
                        libp2p: options.libp2p
                    });
                };
                break;

            case Component.ORBITDB:
                if(options?.identityProvider && options?.enableDID) {
                    logger({
                        level: LogLevel.INFO,
                        component: Component.ORBITDB,
                        message: '[BaseWorker] Using DID identity provider'
                    });

                    worker = await createOrbitDb({
                        ipfs: options.ipfs,
                        identity: {
                            provider: options.identityProvider
                        },
                    });
                } else if (!options?.ipfs) {
                    logger({
                        level: LogLevel.ERROR,
                        component: Component.ORBITDB,
                        message: '[BaseWorker] No ipfs instance provided'
                    });
                }
                else {
                    worker = await createOrbitDb({
                        ipfs: options.ipfs
                    });
                }
                break;

            case Component.DB:
                worker = await options.orbitdb.open(
                    options.databaseName, { 
                        type: options.databaseType 
                });
                break;

            default:
                logger({
                    level: LogLevel.ERROR,
                    message: '[BaseWorker] Unknown worker type'
                });
                break;
        }

        logger({
            level: LogLevel.INFO,
            message: `[BaseWorker] Worker created: ${this.type}`
        
        })

        return worker;
    }

    public createCommands = async (commands?: BaseCommand[]): Promise<BaseCommand[]> => {
        if (commands) {
            this.commands = commands;
        }
        else {
            this.commands = [];
        }

        return this.commands;
    }
}


export {
    IBaseWorker,
    BaseWorker,
    IWorkerOptions,
    WorkerOptions,
    WorkerType,
    DefaultWorkerOptions
}