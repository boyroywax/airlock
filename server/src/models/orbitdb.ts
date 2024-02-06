import { IPFSNode } from "../db/ipfs/index.js";
import { OrbitDBNode } from "../db/orbitdb/node.js";

enum OrbitDBTypes {
  EventLog = 'events',
  Documents = 'documents',
  KeyValue = 'keyvalue',
  Custom = 'custom',
  MetaData = 'meta'
}

interface IOrbitDBOptions {
  databaseType: OrbitDBTypes;
  databaseName: string;
}

interface IOpenDBOptions extends IOrbitDBOptions {
  orbitDBWorker: OrbitDBNode;
}

interface IOrbitDBDIDOptions {
  enableDID: boolean;
}

interface IOrbitDBNodeSetup {
  ipfs: IPFSNode;
}

interface IOrbitDBNodeOptions extends IOrbitDBDIDOptions, IOrbitDBNodeSetup {}

interface IOrbitDBManifest {
  name: string;
  type: OrbitDBTypes;
  accessController: string;
}

export {
  OrbitDBTypes,
  IOrbitDBOptions,
  IOrbitDBDIDOptions,
  IOrbitDBManifest,
  IOrbitDBNodeOptions,
  IOpenDBOptions
}