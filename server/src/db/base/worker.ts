import {
    defaultLibp2pConfig
} from '../publicConfigDefault.js';

import {
    logger
} from '../../utils/index.js';
import { LogLevel } from '../../models/constants.js';


interface IBaseWorkerOptions<T> {
    options?: any;
}


class DefaultWorkerOptions<T>
    implements IBaseWorkerOptions<T>
{
    public options: T;

    public constructor(type: string) {

        switch (type) {
            case 'libp2p':
                this.options = defaultLibp2pConfig as T;
                break;
            default:
                logger({
                    level: LogLevel.ERROR,
                    message: '[DefaultWorkerOptions] Unknown worker type'
                });
                this.options = {} as T;
        }
    }
}


interface IBaseWorker<T, U>
{
    worker?: T;
    options?: U;

    createWorker: (options?: U) => Promise<T>;
}

class BaseWorker<T, U>
    implements IBaseWorker<T, U>
{
    public worker?: T;
    public options?: U;

    public constructor(worker?: T, options?: U) {
        this.worker = worker
        this.options = options;

        if (!options) {
            this.options = new DefaultWorkerOptions<U>().options;
        }

        if (!this.worker) {
            this.createWorker(this.options)
                .then( (worker: T) => {
                    this.worker = worker;
                })
                .catch( (error: Error) => {
                    console.log('Error creating worker', error);
                    this.worker = {} as T;
                }
            );
        }
    }

    public createWorker = async (options?: U): Promise<T> => {
        return {} as T;
    }
}





export {
    IBaseWorker,
    BaseWorker
}