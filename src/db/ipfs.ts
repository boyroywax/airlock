import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { Helia, createHelia } from 'helia'

import { LibP2pNode } from './libp2pConfig';
import { Libp2p } from 'libp2p/dist/src';

class IPFSNode {
  public constructor() {
    const initialize = async () => {
      const ipfs = await this.create();
      this.instance = ipfs;
    };

    initialize();
  }

  public heliaInitConfig: any = {


  private async create(): Promise<{ ipfs: Helia }> {
    const datastore = new MemoryDatastore()
    const blockstore = new MemoryBlockstore()

    const libp2pNode: Libp2p = new LibP2pNode().instance as Libp2p

    const ipfs: Helia = await createHelia({
      blockstore,
      datastore,
      libp2p: libp2pNode.instance
    })

    return ipfs
  }



}




export class OrbitDBNode {

  public orbitdbNode: any = null;
  public helia: Helia | null = null;
  public libp2pNode: Libp2p | null = null;
  public enableDID: boolean | null = null;
  public openDb: any = null;

  public constructor(
    {
      databaseType = OrbitDBTypes.EventLog,
      databaseName = 'orbitdb',
      enableDID = false
    }: OrbitDBNodeOptions = {
      databaseType: OrbitDBTypes.EventLog,
      databaseName: 'orbitdb',
      enableDID: false
    }
  ) {
    const initialize = async () => {
      const { orbitdb, helia, libp2pNode } = await this.createNode({
        enableDID
      });
      this.orbitdbNode = orbitdb;
      this.helia = helia;
      this.libp2pNode = libp2pNode;

      if (databaseName !== null && databaseType !== null) {
        const { db } = await this.startNode({
          databaseName,
          databaseType
        });
        this.openDb = db;
      }
    };

    initialize();
  }

  public async createNode(
    {
      enableDID = false
    }: OrbitDBDIDOptions = {
      enableDID: false
    }
  ): Promise<{ orbitdb: any, helia: any, libp2pNode: any }> {
    const datastore = new MemoryDatastore()
    const blockstore = new MemoryBlockstore()

    const libp2pNode = await createLibp2p(libp2pConfig)

    const helia: Helia = await createHelia({
      blockstore,
      datastore,
      libp2p: libp2pNode
    })

    let orbitdb: any = null

    if (enableDID) {

      const seed = new Uint8Array([157, 94, 116, 1918, 1339, 248, 93, 239, 173, 82, 245, 222, 199, 7, 183, 177, 123, 238, 83, 240, 143, 188, 87, 191, 33, 95, 58, 136, 46, 218, 219, 245])

      OrbitDBIdentityProviderDID.setDIDResolver(KeyDidResolver.getResolver())
      useIdentityProvider(OrbitDBIdentityProviderDID)
      const didProvider = new Ed25519Provider(seed)
      const provider = OrbitDBIdentityProviderDID({ didProvider })
      orbitdb = await createOrbitDB({
        ipfs: helia,
        identity: { provider } 
      })
    }
    else {
      orbitdb = await createOrbitDB({
        ipfs: helia
      })
    }
    
    return { orbitdb, helia, libp2pNode }
    
  }

  public async startNode(
    {
      databaseName = 'orbitdb',
      databaseType = OrbitDBTypes.EventLog
    }: OrbitDBOptions = {
      databaseName: 'orbitdb',
      databaseType: OrbitDBTypes.EventLog
    }
  ): Promise<{ db: any }> {
    const db = await this.orbitdbNode.open(databaseName, { type: databaseType })

    const listenAddrs = this.libp2pNode?.getMultiaddrs()
    console.log('libp2p is listening on the following addresses: ', listenAddrs)

    console.log('OrbitDB address: ', db.address.toString())

    // libp2pNode.addEventListener('peer:discovery', async (evt: any) => {
    //   console.log('Discovered %s', evt.detail.id.toString()) // Log discovered peer
    // })

    // libp2pNode.addEventListener('peer:connect', (evt: any) => {
    //   console.log('Connected to %s', evt.detail.toString()) // Log connected peer
    // })

    return { db }
  }



  public async closeDb() {
    await this.openDb.close()
    return 'Database closed'
  }
}

