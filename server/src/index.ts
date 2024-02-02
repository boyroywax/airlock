import { AirlockServerApi } from './api/index.js';
import { OrbitDBNode, OrbitDBNodeManager } from './db/index.js';
import { OrbitDBNodeOptions } from './models/orbitdb.js';

class AirlockServerOptions {
    public port: number = 3000;

    public constructor(port: number) {
        this.port = port;
    }
}

class AirlockServer {
    public manager: OrbitDBNodeManager;

    public constructor(
        orbtiDBNodeOptions: OrbitDBNodeOptions[],
        serverOptions: AirlockServerOptions
    ) {
        this.manager = new OrbitDBNodeManager();

        for (const options of orbtiDBNodeOptions) {
            this.manager.createNode(options);
            console.log(`OrbitDB Node created: ${options.databaseName}`);
        }

        const server = new AirlockServerApi(
            this.manager,
            serverOptions
        );
    }
}

export {
    AirlockServer,
    AirlockServerOptions,
    OrbitDBNodeManager,
    OrbitDBNode
}