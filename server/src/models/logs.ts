import {
    INode,
    INodeActionResponse
} from './node.js';

import {
    Component,
    ResponseCode,
    LogLevel
} from './constants.js';

interface ILogEntry {
    level?: LogLevel;
    code?: ResponseCode;
    timestamp: Date;
    message: string | INodeActionResponse;
    workerId?: INode['id'];
}

interface ILogBook {
    name: string;
    history: Map<number, ILogEntry>;

    add: (entry: ILogEntry) => void;
    get: (id: number) => ILogEntry;
    delete: (id: number) => void;
    clear: () => void;
    getAll: () => Map<number, ILogEntry>;
    getWorkerHistory: (workerId: INode['id']) => Map<number, ILogEntry>;
    getLastEntries: (count: number) => Map<number, ILogEntry>;
}

interface ILogBooksManager {
    books: Map<string, ILogBook>;

    create: (name: string) => void;
    get: (name: string) => ILogBook;
    delete: (name: string) => void;
    clear: () => void;
}

export {
    ILogEntry,
    ILogBook,
    ILogBooksManager
}