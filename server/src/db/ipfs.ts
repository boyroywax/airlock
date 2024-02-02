import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { Helia, createHelia } from 'helia'
import { Libp2p } from 'libp2p'

import { Libp2pNode } from './libp2p.js'

class IPFSNode {
  public instance: Helia | null = null;

  public constructor() {
    const initialize = async () => {
      const ipfs = await this.create();
      this.instance = ipfs;
    };

    initialize();
  }

  private async create(): Promise<Helia> {
    const datastore = new MemoryDatastore()
    const blockstore = new MemoryBlockstore()

    const libp2pNode: Libp2p = new Libp2pNode().instance as Libp2p

    const ipfs: Helia = await createHelia({
      blockstore,
      datastore,
      libp2p: libp2pNode
    })

    return ipfs 
  }
}

export {
  IPFSNode
}