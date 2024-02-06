import { INode, INodeActionResponse } from './node.js';


enum LogBooks {
    DB = 'db',
    IPFS = 'ipfs',
    LIBP2P = 'libp2p',
    ORBITDB = 'orbitdb',
} 

interface INodeLogEntry {
    codes?: number[];
    timestamp: Date;
    message: string | INodeActionResponse;
    workerId: INode['id'];
}

interface INodeLogBook {
    name: LogBooks;
    history: Map<number, INodeLogEntry>;

    add: (entry: INodeLogEntry) => void;
    get: (id: number) => INodeLogEntry;
    delete: (id: number) => void;
    clear: () => void;
    getAll: () => Map<number, INodeLogEntry>;
    getWorkerHistory: (workerId: INode['id']) => Map<number, INodeLogEntry>;
    getLastEntries: (count: number) => Map<number, INodeLogEntry>;
}

interface ILogBooksManager {
    books: Map<string, INodeLogBook>;

    create: (name: LogBooks) => void;
    get: (name: LogBooks) => INodeLogBook;
    delete: (name: LogBooks) => void;
    clear: () => void;
}

export {
    INodeLogEntry,
    INodeLogBook,
    LogBooks as LogBookNames,
    ILogBooksManager
}