import { ApiServer } from './api/server.js';
import { OrbitDBNode } from './db/index.js';



class Airlock {
    public static main() {
        const orbitDbOptions = {
            databaseName: 'ab1-orbitdb-ipfs-trnkt-xyz',
            databaseType: 'events',
            enableDID: true
        }
        const odb = new OrbitDBNode(orbitDbOptions);

        const apiServer = new ApiServer();
        apiServer.start();
    }
}


Airlock.main();
