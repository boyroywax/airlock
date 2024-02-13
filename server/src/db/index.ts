import {
    BaseManager
} from './base/index.js';

import {
    IBaseNodeOptions,
    defaultNodeOptions
} from './base/nodeOptions';


const createManager = (
    options?: IBaseNodeOptions[]
) => {
    return new BaseManager({
        options: options ? options : defaultNodeOptions()
    });
}

export {
    createManager,
    BaseManager
}
