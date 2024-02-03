import express, { Request, Response, } from 'express';

import { IPFSNode, IPFSNodeConfig, IPFSNodesManager } from '../../db/ipfs/index.js';
import { IPFSBaseRequest } from '../../models/api.js';
import { INodeActionResponse } from '../../models/node.js';


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
 *        properties:
 *         id:
 *          type: string
 *          example: "abcd123"
 *         options:
 *          type: object
 *          properties:
 *           libp2pWorkerID:
 *            type: string
 *            example: "abcd123"
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
    const config: IPFSNodeConfig = req.body as IPFSNodeConfig;
    res.send(ipfsNodesManager.create(config));
});
