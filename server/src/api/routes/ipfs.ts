import express, { Request, Response, } from 'express';

import { IPFSNode, IPFSNodeConfig, IPFSNodesManager } from '../../db/ipfs/index.js';
import { IPFSBaseRequest } from '../../models/api.js';
import { INodeActionResponse } from '../../models/node.js';
import { create } from 'domain';


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
        message: `IPFS Node ${config.id} not found`,
        error: new Error(`IPFS Node ${config.id} not found`)
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
 *          libp2pWorkerID:
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
router.post('/ipfs/create', async function(req: IPFSBaseRequest, res: Response) {
    const id = req.body.id;
    const options = req.body.options;

    const config = new IPFSNodeConfig(id, options as IPFSNodeConfig['options']);
    const response = createNode(config);
    res.send(response);
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

export {
    router as ipfsRouter
}
