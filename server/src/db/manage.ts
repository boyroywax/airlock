import { OrbitDBOptions } from "../models/orbitdb.js";
import { OrbitDBNode } from "./setup.js";


class OrbitDBNodeManager {
    nodes: Map<string, OrbitDBNode>;

    constructor() {
        this.nodes = new Map<string, OrbitDBNode>();
    }

    public createNode(options: OrbitDBOptions): { message: string }{
        const node = new OrbitDBNode(options);
        this.nodes.set(options.databaseName, node);
        return {
            message: `OrbitDB Node ${options.databaseName} created`
        }
    }

    public getNode(databaseName: string): OrbitDBNode | undefined{
        return this.nodes.get(databaseName);
    }
    
    public listNodes(): Map<string, OrbitDBNode> {
        return this.nodes;
    }

    public deleteNode(databaseName: string): { message: string }{
        this.nodes.delete(databaseName);
        return {
            message: `OrbitDB Node ${databaseName} deleted`
        }
    }
}

export { OrbitDBNodeManager }