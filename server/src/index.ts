import { ApiServer, ApiServerOptions } from './api/index.js';



class AirlockServer {
    public api: ApiServer;

    constructor(
        options?: ApiServerOptions
    ) {
        this.api = new ApiServer(options);
    }

    public init() {
        this.api.start();
    }
}

const airlockServer = new AirlockServer();
airlockServer.init();

export {
    AirlockServer,
    airlockServer
}