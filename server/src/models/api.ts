import { Request } from 'express';

interface Libp2pBaseRequest extends Request {
    body: {
        id: string;
    }
}

interface IPFSBaseRequest extends Request {
    body: {
        id: string;
        options?: {}
    }
}

export {
    Libp2pBaseRequest,
    IPFSBaseRequest
}