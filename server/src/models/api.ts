import { Request } from 'express';

interface Libp2pBaseRequest extends Request {
    body: {
        id: string;
    }
}

interface IPFSBaseRequest extends Request {
    body: {
        id: string;
    }
}

interface IPFSCreateRequest extends Request {
    body: {
        id: string;
        options: {
            libp2pWorkerID: string;
        }
    }
}

export {
    Libp2pBaseRequest,
    IPFSCreateRequest,
    IPFSBaseRequest
}