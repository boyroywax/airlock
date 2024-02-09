import {
    BaseStatus,
    IBaseStatus
} from './node.js'

import {
    ResponseCodes
} from '../../models/logs.js'

interface IBaseResponseObject<T> {
    object: T;
}

class BaseResponseObject<T>
    implements IBaseResponseObject<T>
{
    object: T;

    constructor(object: T) {
        this.object = object
    }
}

interface IBaseResponse<T> {
    code: ResponseCodes;
    status: IBaseStatus;
    output?: IBaseResponseObject<T>;
}

class BaseResponse<T>
    implements IBaseResponse<T>
{
    code: ResponseCodes;
    status: BaseStatus;
    output?: BaseResponseObject<T>;

    constructor(
        code: ResponseCodes,
        status: BaseStatus,
        output?: BaseResponseObject<T>,
    ) {
        this.code = code;
        this.status = status;
        this.output = output;
    }
}

export {
    IBaseResponseObject,
    BaseResponseObject,
    IBaseResponse,
    BaseResponse
}