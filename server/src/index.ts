import { ApiServer, ApiServerOptions } from './api/index.js';
import { Libp2pNodeConfig } from './db/libp2p/node.js';

class AirlockServerOptions {
    public apiConfig: ApiServerOptions;
    public libp2pConfig: Libp2pNodeConfig;

    public constructor(
        apiConfig: ApiServerOptions = new ApiServerOptions(),
        libp2pConfig: Libp2pNodeConfig = new Libp2pNodeConfig()
    ) {
        this.apiConfig = apiConfig;
        this.libp2pConfig = libp2pConfig;
    }
}

class AirlockServer {
    public api: ApiServer;

    constructor(
        options: AirlockServerOptions = new AirlockServerOptions()
    ) {
        this.api = new ApiServer(options.apiConfig)
    }

    public init() {
        this.api.start();
    }
}

const airlockServer = new AirlockServer();
airlockServer.init();

export {
    AirlockServer,
    AirlockServerOptions
}