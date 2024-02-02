import { Libp2p } from 'libp2p';

interface ILibp2pInstanceOptions {
    id: string;
    libp2pConfig: any;
    instance: Libp2p | null;
}

export {
    ILibp2pInstanceOptions
}

