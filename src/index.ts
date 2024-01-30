import { ApiServer } from './api/server';


class Airlock {
    public static main() {
        const apiServer = new ApiServer();
        apiServer.start();
    }
}


Airlock.main();
