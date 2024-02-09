import {
    Libp2p,
    Libp2pOptions,
    // createLibp2p
} from 'libp2p';

import {
    defaultLibp2pConfig
} from '../publicConfigDefault.js';

import {
    Helia,
    // createHelia
} from 'helia';

import {
    MemoryBlockstore
} from 'blockstore-core'

import {
    MemoryDatastore
} from 'datastore-core'

import {
    // createOrbitDb,
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
    LogLevel,
    ResponseCode
} from '../../models';

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
                    component: Component.ORBITDB,
                    code: ResponseCode.NOT_FOUND,
                    message: `No identity seed provided. Using hardcoded seed...`
                });
                this.identitySeed = new Uint8Array([157, 94, 116, 1918, 1239, 238, 91, 229, 173, 82, 245, 222, 199, 7, 183, 177, 123, 238, 83, 240, 143, 188, 87, 191, 33, 95, 58, 136, 46, 218, 219, 245]);
            }

            try {
                OrbitDBIdentityProviderDID.setDIDResolver(KeyDidResolver.getResolver())
                useIdentityProvider(OrbitDBIdentityProviderDID)
                const didProvider = new Ed25519Provider(this.identitySeed)
                this.identityProvider = OrbitDBIdentityProviderDID({ didProvider })
            } catch (error: any) {
                logger({
                    level: LogLevel.ERROR,
                    component: Component.ORBITDB,
                    code: ResponseCode.INTERNAL_SERVER_ERROR,
                    message: `Error creating DID identity provider: ${error}`
                })
            }
        }
        logger({
            level: LogLevel.INFO,
            component: Component.ORBITDB,
            message: `Options: ${JSON.stringify({
                enableDID: this.enableDID,
                databaseName: this.databaseName,
                databaseType: this.databaseType
            })}`,
        })
    }
}





export {
    IWorkerOptions,
    WorkerOptions,
    WorkerType,
    DefaultWorkerOptions,
    OrbitDbWorkerOptions
}