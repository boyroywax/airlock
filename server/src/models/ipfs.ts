enum IPFSNodeType {
    PUBLIC = 'public',
    PRIVATE = 'private',
    HYBRID = 'hybrid',
    CLUSTER = 'cluster'
}


interface IIPFSNodeOptions {
    type: IPFSNodeType;
    name: string;
    id: string;
}

export {
    IPFSNodeType,
    IIPFSNodeOptions
}