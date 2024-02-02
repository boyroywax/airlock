import { ApiServer } from "./server.js";
import { OrbitDBNodeManager } from "../db/index.js";
import { AirlockServerOptions } from "../index.js";

class AirlockServerApi {
    public manager: OrbitDBNodeManager;

    public constructor(
        manager?: OrbitDBNodeManager,
        options?: AirlockServerOptions,
    ) {
        if (manager) {
            this.manager = manager;
        }
        else {
            this.manager = new OrbitDBNodeManager();
        }
        const server = new ApiServer(options);
    }
}

export {
    AirlockServerApi
}