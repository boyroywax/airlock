import { createOrbitDB, useIdentityProvider } from '@orbitdb/core'
import OrbitDBIdentityProviderDID from '@orbitdb/identity-provider-did'
import KeyDidResolver from 'key-did-resolver'
import { Ed25519Provider } from 'key-did-provider-ed25519'

import { IPFSNode } from "./ipfs.js"
import { OrbitDBManifest, OrbitDBNodeOptions, OrbitDBTypes } from '../models/orbitdb.js'


class OrbitDBNode {
  public orbitdbOptions: OrbitDBNodeOptions
  public ipfs: IPFSNode
  public instance: any = null
  public openDb: any = null
  public manifest: OrbitDBManifest | null = null

  public constructor(
    orbitdbOptions: OrbitDBNodeOptions,
    ipfs?: IPFSNode
  ) {
    if (ipfs === undefined) {
      this.ipfs = new IPFSNode()
    }
    else {
      this.ipfs = ipfs
    }
    this.orbitdbOptions = orbitdbOptions

    const initialize = async () => {
      this.instance = await this.createNode()
      this.openDb = await this.openOrbitDb()
    }

    initialize()
  }

  private configNode() {
    const identity = this.orbitdbOptions.enableDID ? { provider: this.enableDID() } : null;
    return {
      directory: this.createRandomDirectory(),
      ...(identity && { identity })
    }
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
   
  private async createNode() {
    const config = this.configNode()
    this.instance = await createOrbitDB(this.ipfs.instance, config)
    return this.instance
  }

  private async openOrbitDb() {
    this.openDb = this.instance.open(
      this.orbitdbOptions.databaseName, 
      {
        type: this.orbitdbOptions.databaseType
      }
    )
  }

  public async addData(data: any) {
    return await this.openDb.add(data)
  }

  public async putData(data: any) {
    return await this.openDb.put(data)
  }

  public async getData(hash: string) {
    return await this.openDb.get(hash)
  }

  public async getAllData() {
    return await this.openDb.all()
  }

  public closeDb() {
    this.openDb.close()
    return 'Database closed'
  }
}

export {
  OrbitDBNode
}