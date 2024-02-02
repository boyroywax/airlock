import { OrbitDBOptions } from "../models/orbitdb.js";
import { OrbitDBNode } from "./setup.js";


class OrbitDBNodeManager {
    nodes: Map<string, OrbitDBNode>;

    constructor() {
        this.nodes = new Map<string, OrbitDBNode>();
    }

    public createNode(options: OrbitDBOptions) {
        const node = new OrbitDBNode(options);
        this.nodes.set(options.databaseName, node);
    }

    public getNode(databaseName: string) {
        return this.nodes.get(databaseName);
    }

    public deleteNode(databaseName: string) {
        this.nodes.delete(databaseName);
    }
}

export { OrbitDBNodeManager }