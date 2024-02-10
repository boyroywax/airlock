import {
    Libp2p,
    createLibp2p
} from 'libp2p';

import {
    Helia,
    createHelia
} from 'helia';

import {
    createOrbitDb,
    OrbitDb,
    Database
} from '@orbitdb/core';

import {
    WorkerOptions,
    DefaultWorkerOptions
} from './workerOptions.js';

import {
    logger
} from '../../utils/index.js';

import {
    Component,
    LogLevel,
    ResponseCode
} from '../../models';

import {
    BaseCommandProperties,
    createBaseCommands
} from './commands.js';

type WorkerType = Libp2p | Helia | typeof OrbitDb | typeof Database;


/**
 * @interface IBaseWorker
 * @description Base Worker Interface
 * @member worker: WorkerType
 * @member options: WorkerOptions
 * @method createWorker: (options?: WorkerOptions) => Promise<WorkerType>
 */
interface IBaseWorker
{
    id?: string;
    type?: Component;
    worker?: WorkerType;
    options?: WorkerOptions;
    commands?: BaseCommandProperties[];

    createWorker: (
        options: WorkerOptions
    ) => Promise<WorkerType>;

    createCommands: (
        commands: BaseCommandProperties[]
    ) => BaseCommandProperties[];
}


/**
 * @class BaseWorker
 * @description Base Worker
 * @implements IBaseWorker
 * @member worker: WorkerType
 * @member options: WorkerOptions
 * @member commands: BaseCommandParameters[]
 * @method createWorker: (options: WorkerOptions) => Promise<WorkerType>
 * @method createCommands: (commands: BaseCommandProperties[]) => BaseCommandProperties[]
 */
class BaseWorker
    implements IBaseWorker
{
    public id?: string;
    public type?: Component;
    public options?: WorkerOptions;
    public process?: WorkerType;
    public commands?: BaseCommandProperties[];

    public constructor({
        type,
        options,
        commands
    } : {
        type: Component,
        options?: WorkerOptions,
        commands?: BaseCommandProperties[]
    }) {
        
        if (type === null && options?.type === undefined) {
            logger({
                level: LogLevel.ERROR,
                component: Component.SYSTEM,
                code: ResponseCode.BAD_REQUEST,
                message: `Worker type not found in options or arguments`
            });
            return;
        }
        else if (type === null && options?.type !== undefined) {
            this.type = options.type;
        }
        else {
            this.type = type;
        }

        this.options = new DefaultWorkerOptions(this.type, options);

        this.id = this.options.id;
        this.commands = commands ? commands : new Array<BaseCommandProperties>();

        // check for an existing worker
        if (this.process) {
            logger({
                level: LogLevel.INFO,
                component: type,
                code: ResponseCode.SUCCESS,
                message: `[${this.id}] Worker already exists: ${this.type}`
            });
            return;
        }

        // check if the process is in the options
        switch (this.type) {
            case Component.LIBP2P:
                if (this.options.libp2p) {
                    this.process = this.options.libp2p;
                }
                break;
        
            case Component.IPFS:
                if (this.options.ipfs) {
                    this.process = this.options.ipfs;
                }
                break;

            case Component.ORBITDB:
                if (this.options.orbitdb) {
                    this.process = this.options.orbitdb;
                }
                break;

            case Component.DB:
                if (this.options.orbitdb) {
                    this.process = this.options.orbitdb;
                }
                break;

            default:
                break;
        }

        this.createWorker(this.options)
            .then( (worker) => {
                this.process = worker;
            })
            .catch( (error: Error) => {
                logger({
                    level: LogLevel.ERROR,
                    component: type,
                    code: ResponseCode.INTERNAL_SERVER_ERROR,
                    message: `[${this.id}] Error creating worker: ${error}`
                });
            }).finally( () => {
                if (this.process) {
                    logger({
                        level: LogLevel.INFO,
                        component: type,
                        code: ResponseCode.SUCCESS,
                        message: `[${this.id}] Worker created: ${this.type}`
                    });
                }
            })

        try {
            this.commands = this.createCommands(this.commands);
            logger({
                level: LogLevel.INFO,
                component: type,
                code: ResponseCode.SUCCESS,
                message: `[${this.id}] Commands created: ${this.commands}`
            });
        } catch (error: any) {
            logger({
                level: LogLevel.ERROR,
                component: type,
                code: ResponseCode.INTERNAL_SERVER_ERROR,
                message: `[${this.id}] Error creating commands: ${error}`
            });
        } finally {
            if (this.commands) {
                logger({
                    level: LogLevel.INFO,
                    component: type,
                    code: ResponseCode.SUCCESS,
                    message: `[${this.id}] Worker created: ${this.type}`
                });
            }
        }
    }

    public createWorker = async (
        options: WorkerOptions
    ): Promise<WorkerType> => {
        let worker: WorkerType = null;
        options = this.options ? this.options : new DefaultWorkerOptions(options);

        switch (this.type) {
            case Component.LIBP2P:
                worker = await createLibp2p({
                    ...options.libp2pOptions
                });
                break;
        
            case Component.IPFS:
                worker = await createHelia({
                    libp2p: options.libp2p
                });
                break;

            case Component.ORBITDB:
                if(options?.identityProvider && options?.enableDID) {
                    logger({
                        level: LogLevel.INFO,
                        component: Component.ORBITDB,
                        message: `[${this.id}] Using DID identity provider`
                    });

                    worker = await createOrbitDb({
                        ipfs: options.ipfs,
                        identity: {
                            provider: options.identityProvider
                        },
                    });
                }
                else {
                    worker = await createOrbitDb({
                        ipfs: options.ipfs
                    });
                };
                break;

            case Component.DB:
                worker = await options.orbitdb.open(
                    options.databaseName, { 
                        type: options.databaseType
                    }
                );
                break;

            default:
                logger({
                    level: LogLevel.ERROR,
                    code: ResponseCode.NOT_FOUND,
                    message: `[${this.id}] Unknown worker type`
                });
                break;
        }
        return worker;
    }

    public createCommands = (
        commands?: BaseCommandProperties[]
    ): BaseCommandProperties[] => {
        if (commands) {
            this.commands = commands;
        }
        else {
            this.commands = new Array<BaseCommandProperties>();
        }

        switch (this.type) {
            case Component.LIBP2P:
                this.commands = createBaseCommands(this.process, this.type);
                break;

            default:
                break;
        }

        return this.commands;
    }
}


export {
    IBaseWorker,
    BaseWorker,
    WorkerType,
}