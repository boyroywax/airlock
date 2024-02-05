import { IPFSNode } from "../db/ipfs";

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
}