import { createOrbitDB, useIdentityProvider } from '@orbitdb/core'
import OrbitDBIdentityProviderDID from '@orbitdb/identity-provider-did'
import KeyDidResolver from 'key-did-resolver'
import { Ed25519Provider } from 'key-did-provider-ed25519'

import { IPFSNode } from "./ipfs.js"
import { OrbitDBManifest, OrbitDBNodeOptions } from '../models/orbitdb.js'


class OrbitDBInstance {
  public ipfs: IPFSNode
  public orbitdbOptions: OrbitDBNodeOptions
  public instance: any = null

  public constructor(ipfs: IPFSNode, orbitdbOptions: OrbitDBNodeOptions) {
    this.ipfs = ipfs
    this.orbitdbOptions = orbitdbOptions
  }

  private configNode() {
    let config = {}
    if (this.orbitdbOptions.enableDID) {
      config = { identity: { provider: this.enableDID()} }
    }
    config['directory'] = this.createRandomDirectory()
    return config
    

  public async createNode() {
    
    this.instance = await createOrbitDB(this.ipfs.instance, { })
  }

  private enableDID() {
    const seed = new Uint8Array([157, 94, 116, 1918, 1339, 248, 93, 239, 173, 82, 245, 222, 199, 7, 183, 177, 123, 238, 83, 240, 143, 188, 87, 191, 33, 95, 58, 136, 46, 218, 219, 245])

    OrbitDBIdentityProviderDID.setDIDResolver(KeyDidResolver.getResolver())
    useIdentityProvider(OrbitDBIdentityProviderDID)
    const didProvider = new Ed25519Provider(seed)
    const provider = OrbitDBIdentityProviderDID({ didProvider })
    return provider
  }

  private createRandomDirectory() {
    return Math.random().toString(36).substring(7)
  }

  private async openDb() {

  }



}




class OrbitDBSetup {
  public constructor(ipfs: IPFSNode) {
    this.ipfs = ipfs
  }
  
  public async createNode() {
    this.orbitdb = createOrbitDB(this.ipfs.instance, { })
  }

  public async openDb(options: any) {
    const orbitdb = await this.orbitdb.open(
      options.databaseName,
      options.databaseType, 
      {
        ipfs: this.ipfs,
        accessController: {
          write: ['*']
        }
      }
    )
    return new OrbitDBActions(orbitdb)
  }


}

class OrbitDBActions {
  private openDb: any

  public constructor(openDb: any) {
    this.openDb = openDb
  }

  public async addData(data: any) {
    await this.openDb.add(data)
    return 'Data added'
  }

  public async putData(data: any) {
    await this.openDb.put(data)
    return 'Data added'
  }

  public async getData(hash: string) {
    const data = await this.openDb.get(hash)
    return data
  }

}