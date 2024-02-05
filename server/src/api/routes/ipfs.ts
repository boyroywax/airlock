import express, { Request, Response, } from 'express';

import { IPFSNode, IPFSNodeConfig, IPFSNodesManager } from '../../db/ipfs/index.js';
import { IPFSBaseRequest, IPFSCreateRequest } from '../../models/api.js';
import { INodeActionResponse } from '../../models/node.js';
import { IHeliaNodeOptions } from '../../models/helia.js';
import { libp2pNodesManager } from './libp2p.js';
import { Libp2pNode } from '../../db/index.js';

const router = express.Router();

const ipfsNodesManager = new IPFSNodesManager();

/**
 * @constant activeNode
 * @param id : IPFSNode['id'] | string
 * @returns : IPFSNode
 * @description Returns the active IPFS node instance
 * @summary This function returns the active IPFS node instance,
 *          if the node is not found, it will return an error
 */
const activeNode = (id: IPFSNode['id']): IPFSNode | INodeActionResponse => {
    return ipfsNodesManager.get(id);
}

const createNode = (config: IPFSNodeConfig): IPFSNode | INodeActionResponse => {
    if (ipfsNodesManager.create(config).code === 200) {
        return ipfsNodesManager.get(config.id) as IPFSNode;
    }
    return {
        code: 202,
        message: `IPFS Node ${config.id} not created`,
        error: new Error(`IPFS Node ${config.id} not created`)
    } as INodeActionResponse
}

/**
 * @openapi
 * components:
 *  schemas:
 *   IPFSNode:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      description: The System Worker ID of the IPFS node
 *      example: "abcd123"
 *     peerID:
 *      type: string
 *      description: The Peer ID of the IPFS node
 *      example: "QmXt3Yz8v3Z6"
 *     libp2pWorkerID:
 *      type: string
 *      description: The System Worker ID of the libp2p node
 *      example: "abcd123"
 *     status:
 *      type: string
 *      description: The status of the IPFS node
 *      example: "started"
 */

/**
 * @openapi
 * /api/v0/ipfs/create:
 *  post:
 *   summary: Creates an IPFS node
 *   tags:
 *    - ipfs
 *   requestBody:
 *    description: Set the node ID and options
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        id:
 *         type: string
 *         example: "abcd123"
 *        options:
 *         type: object
 *         properties:
 *          libp2pWorkerId:
 *           type: string
 *           example: "abcd123"
 *   responses:
 *    200:
 *     description: The result of the operation
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *     example: /or
 */
router.post('/ipfs/create', async function(req: IPFSCreateRequest, res: Response) {
    const id = req.body.id;
    const options = req.body.options;
    const libp2pNode: Libp2pNode | INodeActionResponse = libp2pNodesManager.get(options.libp2pWorkerId);

    if (libp2pNode instanceof Libp2pNode) {
        const config = new IPFSNodeConfig(id, {libp2p: libp2pNode} as IHeliaNodeOptions);
        const response = createNode(config);
        res.send(response);
    }
    else {
        res.send(libp2pNode);
    }
});


/**
 * @openapi
 * /api/v0/ipfs/list:
 *  get:
 *   summary: Lists all IPFS nodes
 *   tags:
 *    - ipfs
 *   responses:
 *    200:
 *     description: The list of IPFS nodes
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/IPFSNode'
 *     example: /or
 */
router.get('/ipfs/list', async function(req: Request, res: Response) {
    res.send(ipfsNodesManager.list());
});

/**
 * @openapi
 * /api/v0/ipfs/node/start:
 *  post:
 *   summary: Starts an IPFS node
 *   tags:
 *    - ipfs
 *   requestBody:
 *    description: Set the node ID
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        id:
 *         type: string
 *         example: "abcd123"
 *   responses:
 *    200:
 *     description: The result of the operation
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *     example: /or
 */
router.post('/ipfs/node/start', async function(req: IPFSBaseRequest, res: Response) {
    const ipfsNodeResponse = activeNode(req.body.id);
    
    if (ipfsNodeResponse instanceof IPFSNode) {
        res.send(await ipfsNodeResponse.start());
    }
    else {
        res.send(ipfsNodeResponse);
    }
    
});

export {
    router as ipfsRouter,
    ipfsNodesManager
}
