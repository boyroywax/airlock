import {
    BaseNodeStatus,
    IBaseNodeStatus
} from './node.js'

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

class BaseNodeResponseObject<T>
    implements IBaseNodeResponseObject<T>
{
    object: T;

    constructor(object: T) {
        this.object = object
    }
}

interface IBaseNodeResponse<T> {
    code: BaseNodeResponseCode;
    status: IBaseNodeStatus;
    output?: IBaseNodeResponseObject<T>;
}

class BaseNodeResponse<T>
    implements IBaseNodeResponse<T>
{
    code: BaseNodeResponseCode;
    status: BaseNodeStatus;
    output?: BaseNodeResponseObject<T>;

    constructor(
        code: BaseNodeResponseCode,
        status: BaseNodeStatus,
        output?: BaseNodeResponseObject<T>,
    ) {
        this.code = code;
        this.status = status;
        this.output = output;
    }
}

export {
    IBaseNodeResponseObject,
    BaseNodeResponseObject,
    BaseNodeResponseCode,
    IBaseNodeResponse,
    BaseNodeResponse
}