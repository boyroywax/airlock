import { createLibp2p, Libp2p } from 'libp2p'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { Helia, createHelia } from 'helia'
import { createOrbitDB, useIdentityProvider } from '@orbitdb/core'
import OrbitDBIdentityProviderDID from '@orbitdb/identity-provider-did'
import KeyDidResolver from 'key-did-resolver'
import { Ed25519Provider } from 'key-did-provider-ed25519'

import { libp2pConfig } from './libp2pConfig.js'


export class OrbitDBNode {

  public orbitdbNode: any = null;
  public helia: Helia | null = null;
  public libp2pNode: Libp2p | null = null;
  public enableDID: boolean | null = null;
  public openDb: any = null;

  constructor({
    databaseType = 'eventlog',
    databaseName = 'orbitdb',
    enableDID = false
  }) {
    this.createNode({
      enableDID
    }).then( ({ orbitdb, helia, libp2pNode }) => {
      this.orbitdbNode = orbitdb
      this.helia = helia
      this.libp2pNode = libp2pNode
    })

    if (databaseName !== null && databaseType !== null) {
      this.startNode({
        databaseName,
        databaseType
      }).then( ({ db }) => {
        this.openDb = db
      })
    }
  }

  public async createNode({
    enableDID = false
  }): Promise<{ orbitdb: any, helia: any, libp2pNode: any }> {
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

  public async startNode({
    databaseName = 'orbitdb',
    databaseType = 'eventlog'
  }): Promise<{ db: any }> {
    const db = await this.orbitdbNode.open(databaseName, {  type: databaseType })

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

  public async addData(data: any) {
    await this.openDb.add(data)
    return 'Data added'
  }

  public async getData(hash: string) {
    const data = await this.openDb.get(hash)
    return data
  }



  public async stopNode() {
    // await this.openDb.close()
    // await this.orbitdbNode.stop()
    // await this.helia.stop()

    return 'Node stopped'
  }
}

// createNode().then(() => {
//   console.log('Node created and OrbitDB opened successfully...')
  
// }).catch((err) => {
//   console.error(err)
// })

  // Close your db and stop OrbitDB and IPFS.
