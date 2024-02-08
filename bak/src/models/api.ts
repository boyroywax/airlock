import { Request, Response } from 'express';
import { INodeActionResponse } from './node';

interface Libp2pBaseRequest extends Request {
    body: {
        id: string;
    }
}

interface Libp2pCommandRequest extends Request {
    body: {
        id: string;
        command: string;
        args: string[]
    }
}

interface Libp2pCommandResponse extends Response {
    body: {
        commandRequest: Libp2pCommandRequest | string;
        code: number;
        message: string | INodeActionResponse;
        output?: any;
        error?: Error;
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

interface OrbitDBNodeCreateRequest extends Request {
    body: {
        id: string;
        options: {
            ipfsWorkerId: string;
        }
    }
}

interface OrbitDBCreateRequest extends Request {
    body: {
        id: string;
        command: string;
        args: {
            orbitDbWorkerId: string;
            databaseName: string;
            databaseType: string;
        }
    }
}

export {
    Libp2pBaseRequest,
    Libp2pCommandRequest,
    Libp2pCommandResponse,
    IPFSBaseRequest,
    IPFSCreateRequest,
    OrbitDBBaseRequest,
    OrbitDBCreateRequest,
    OrbitDBNodeCreateRequest
}