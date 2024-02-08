import { Libp2p } from "libp2p"

import { Libp2pNode } from "../db/libp2p/node.js"
import { MemoryBlockstore } from "blockstore-core"
import { MemoryDatastore } from "datastore-core"

interface IHeliaNodeOptions {
    blockstore: MemoryBlockstore
    datastore: MemoryDatastore
    libp2p: Libp2pNode
}

export {
    IHeliaNodeOptions
}