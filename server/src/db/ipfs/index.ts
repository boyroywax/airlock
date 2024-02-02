import { Helia } from "helia";

import { Libp2pInstance, Libp2pInstanceManager } from "../libp2p/index.js";

class IPFSInstance {
    public id: string;
    public instance: Helia;
    private libp2pInstance: Libp2pInstance;

    public constructor(
        id: string | null = null,
        libp2pInstance: Libp2pInstance | null = null
    ) {
        if (!id) {
            id = Math.random().toString(36).substring(7);
        }
        this.id = id;

        if (!libp2pInstance) {
            this.libp2pInstance = new Libp2pInstanceManager;
        }
        else {
            this.libp2pInstance = libp2pInstance;
        }
    }
}