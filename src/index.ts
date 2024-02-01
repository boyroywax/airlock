import { ApiServer } from './api/server.js';
import { OrbitDBNode } from './db/index.js';
import { OrbitDBNodeManager } from './db/index.js';
import { OrbitDBNodeOptions } from './models/orbitdb.js';

class AirlockServerOptions {
    public port: number = 3000;
}

class AirlockServer {
    public manager: OrbitDBNodeManager;

    public constructor(
        orbtiDBNodeOptions: OrbitDBNodeOptions[]
    ) {
        this.manager = new OrbitDBNodeManager();

        const initialize = async () => {
            for (const options of orbtiDBNodeOptions) {
                this.manager.createNode(options);
            }
        }
        initialize();
    }

    public start() {
        const server = new ApiServer();
        server.start();
    }
}

export {
    AirlockServer,
    AirlockServerOptions,
    OrbitDBNode
}