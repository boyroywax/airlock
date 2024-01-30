enum OrbitDBTypes {
  EventLog = 'events',
  Documents = 'documents',
  KeyValue = 'keyvalue',
  Custom = 'custom',
  MetaData = 'meta'
}

interface OrbitDBOptions {
  databaseType: OrbitDBTypes;
  databaseName?: string;
}

interface OrbitDBDIDOptions {
  enableDID?: boolean;
}

interface OrbitDBNodeOptions extends OrbitDBOptions, OrbitDBDIDOptions {}

interface OrbitDBManifest {
  name: string;
  type: OrbitDBTypes;
  accessController: string;
}

export {
  OrbitDBTypes,
  OrbitDBOptions,
  OrbitDBDIDOptions,
  OrbitDBManifest,
  OrbitDBNodeOptions,
}