import {
    IBaseWorker,
    BaseWorker,
    WorkerProcess
} from '../src/db/base/worker.js';

import {
    expect
} from 'chai';


describe('BaseWorkerTest', () => {
    const baseWorker: IBaseWorker<WorkerProcess> = new BaseWorker<WorkerProcess>({
        type: 'libp2p',
        options: {
            libp2p: {
                modules: {
                    transport: [],
                    streamMuxer: [],
                    connEncryption: [],
                    peerDiscovery: []
                }
            }
        },
        commands: []
    });

    it('should create a worker', async () => {
        const worker: WorkerProcess = await baseWorker.createWorker(baseWorker.options);
        expect(worker).not.to.be.null;
    });

}
