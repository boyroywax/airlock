import { BaseNodeStatus, IBaseNodeStatus } from './node'

enum BaseNodeResponseCode {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
}

interface IBaseNodeResponseObject<T> {
    object: T;
}

class BaseNodeResponseObject<T> implements IBaseNodeResponseObject<T> {
    object: T;

    constructor(object: T) {
        this.object = object
    }
}

interface IBaseNodeResponse {
    code: BaseNodeResponseCode;
    status: IBaseNodeStatus;
    object?: IBaseNodeResponseObject<any>;
}

class BaseNodeResponse implements IBaseNodeResponse {
    code: BaseNodeResponseCode;
    status: BaseNodeStatus;
    object?: BaseNodeResponseObject<any>;

    constructor(
        code: BaseNodeResponseCode,
        status: BaseNodeStatus,
        object?: BaseNodeResponseObject<any>,
    ) {
        this.code = code;
        this.status = status;
        this.object = object;
    }
}

export {
    IBaseNodeResponseObject,
    BaseNodeResponseObject,
    BaseNodeResponseCode,
    IBaseNodeResponse,
    BaseNodeResponse
}