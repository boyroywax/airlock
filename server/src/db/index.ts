import { OrbitDBNodeManager } from "./manage.js";
import { OrbitDBNode } from "./setup.js";
import { OrbitDBNodeOptions } from "../models/orbitdb.js";


class AirlockDB {
    public manager: OrbitDBNodeManager;

    public constructor(
        orbtiDBNodeOptions?: OrbitDBNodeOptions[],
    ) {
        this.manager = new OrbitDBNodeManager();

        if (orbtiDBNodeOptions) {
            this.createNodes(orbtiDBNodeOptions);
        }
    }

    private createNodes(orbtiDBNodeOptions: OrbitDBNodeOptions[]) {
        for (const options of orbtiDBNodeOptions) {
            this.manager.createNode(options);
            console.log(`OrbitDB Node created: ${options.databaseName}`);
        }
    }

    public listNodes() {
        return this.manager.listNodes();
    }
}


export { AirlockDB, OrbitDBNodeManager, OrbitDBNode }

