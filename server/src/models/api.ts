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
            libp2pWorkerId: string;
        }
    }
}

interface OrbitDBBaseRequest extends Request {
    body: {
        id: string;
    }
}

interface OrbitDBCreateRequest extends Request {
    body: {
        id: string;
        options: {
            ipfsWorkerId: string;
        }
    }
}

export {
    Libp2pBaseRequest,
    IPFSBaseRequest,
    IPFSCreateRequest,
    OrbitDBBaseRequest,
    OrbitDBCreateRequest
}