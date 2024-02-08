
import { INode } from "../models/node.js";
import { INodeLogEntry, INodeLogBook, LogBookNames } from "../models/logs.js";

/**
 * @class LogBook
 * @implements INodeLogBook
 * @description A class to manage an individual log book
 */
class LogBook implements INodeLogBook {
    public name: LogBookNames;
    public history: Map<number, INodeLogEntry>;

    public constructor(name: LogBookNames) {
        this.name = name
        this.history = new Map<number, INodeLogEntry>();
    }

    /**
     * @function add
     * @param entry : INodeLogEntry - The entry to add to the log book
     * @returns void
     * @description Adds an entry to the log book
     */
    public add(entry: INodeLogEntry):  void {
        const counter = this.history.size + 1;
        this.history.set(counter, entry);
    }

    /**
     * @function get
     * @param entryId : number - The id of the entry to get
     * @returns INodeLogEntry - The entry
     * @description Gets an entry from the log book
     */
    public get(entryId: number): INodeLogEntry {
        const entry: INodeLogEntry | undefined = this.history.get(entryId);
        if (entry) {
            return entry;
        }
        else {
            throw new Error("Entry not found");
        }
    }

    /**
     * @function delete
     * @param entryId : number - The id of the entry to delete
     * @returns void
     * @description Deletes an entry from the log book
     */
    public delete(entryId: number): void {
        this.history.delete(entryId);
    }

    /**
     * @function getAll
     * @returns Map<number, INodeLogEntry> - A map of all the entries
     * @description Returns a map of all the entries
     */
    public getAll(): Map<number, INodeLogEntry> {
        return this.history;
    }

    /**
     * @function clear
     * @returns void
     * @description Clears the entire log book
     */
    public clear(): void {
        this.history = new Map<number, INodeLogEntry>();
    }

    /**
     * @function getLastEntries
     * @param count : number = 1 - The number of entries to return
     * @returns Map<number, INodeLogEntry> - A map of the last entries
     */
    public getLastEntries(count: number = 1): Map<number, INodeLogEntry> {
        const lastEntries: Map<number, INodeLogEntry> = new Map<number, INodeLogEntry>();
        const historyArray = Array.from(this.history);
        const lastEntriesArray = historyArray.slice(-count);
        lastEntriesArray.forEach((entry) => {
            lastEntries.set(entry[0], entry[1]);
        });
        return lastEntries;
    }

    /**
     * @function getWorkerHistory
     * @param workerId : INode['id'] - The worker id to get the history for
     * @returns Map<number, INodeLogEntry> - A map of the history for the worker
     * @description Returns a map of the history for the worker
     * 
     */
    public getWorkerHistory(workerId: INode['id']): Map<number, INodeLogEntry> {
        const workerHistory: Map<number, INodeLogEntry> = new Map<number, INodeLogEntry>();
        this.history.forEach((entry, key) => {
            if (entry.workerId === workerId) {
                workerHistory.set(key, entry);
            }
        });
        return workerHistory;
    }
}


/**
 * @class LogBooksManager
 * @description A class to manage the system's collection of log books
 */
class LogBooksManager {
    public logBooks: Map<string, LogBook> = new Map<string, LogBook>();

    public constructor() {
        this.create(LogBookNames.DB);
        this.create(LogBookNames.IPFS);
        this.create(LogBookNames.LIBP2P);
        this.create(LogBookNames.ORBITDB);
    }

    /**
     * @function create
     * @param logBookName : LogBookNames - The name of the log book to create
     * @returns void
     * @description Creates a new log book and adds it to the collection
     */
    public create(
        logBookName: LogBookNames
    ) {
        const newLogBook = new LogBook(logBookName);
        this.logBooks.set(newLogBook.name, newLogBook);
    }

    /**
     * @function get
     * @param logBookName  : LogBookNames - The name of the log book to get
     * @returns 
     */
    public get(
        logBookName: LogBookNames
    ): LogBook {
        const logBook: LogBook | undefined = this.logBooks.get(logBookName);
        if (logBook) {
            return logBook;
        }
        else {
            throw new Error("Log Book not found");
        }
    }

    /**
     * @function delete
     * @param logBookName : LogBookNames - The name of the log book to delete
     * @returns void
     * @description Deletes a log book from the collection
     */
    public delete(
        logBookName: LogBookNames
    ) {
        this.logBooks.delete(logBookName);
    }

    /**
     * @function clear
     * @returns void
     * @description Clears all the log books
     */
    public clear() {
        for (const logBook of this.logBooks.values()) {
            logBook.clear();
        }
    }

    /**
     * @function getAllEntries
     * @returns Map<number, LogBook> - A map of all the entries
     * @description Returns a map of all the entries
     */
    public getAllEntries() {
        const allEntries: Map<string, LogBook> = new Map<string, LogBook>();
        for (const logBook of this.logBooks) {
            for (const entry of logBook[1].history) {
                const entryKey = `${logBook[0]}-${entry[0]}`;
                allEntries.set(entryKey, logBook[1]);
            }
        }
        return allEntries;
    }
}

const logger = new LogBooksManager();

const getLogBook = (logBookName: LogBookNames): LogBook => {
    return logger.get(logBookName);
}

export {
    logger,
    getLogBook,
    LogBook,
    LogBooksManager
}