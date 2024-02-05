import express, { Request, Response, } from 'express';

import { OrbitDBNode, OrbitDBNodeConfig, OrbitDBNodesManager } from '../../db/orbitdb/index.js';
import { OrbitDBTypes, OrbitDBBaseRequest, OrbitDBCreateRequest, IOrbitDBNodeOptions, INodeActionResponse } from '../../models/index.js';
import { ipfsNodesManager } from './ipfs.js';
import { IPFSNode } from '../../db/ipfs/node.js';

const router = express.Router();

const orbitDbNodesManager = new OrbitDBNodesManager();

/**
 * @constant activeNode
 * @param id : OrbitDBNode['id'] | string
 * @returns : OrbitDBNode
 * @description Returns the active OrbitDB node instance
 * @summary This function returns the active OrbitDB node instance,
 *          if the node is not found, it will return an error
 */
const activeNode = (id: OrbitDBNode['id']): OrbitDBNode | INodeActionResponse => {
    return orbitDbNodesManager.get(id);
}

/**
 * @function createNode
 * @param config
 * @returns OrbitDBNode
 * @description Creates a new OrbitDB node instance
 * @summary This function creates a new OrbitDB node instance
 *         and returns it
 */
const createNode = (config: OrbitDBNodeConfig): OrbitDBNode | INodeActionResponse => {
    if (orbitDbNodesManager.create(config).code === 300) {
        return orbitDbNodesManager.get(config.id) as OrbitDBNode;
    }
    return {
        code: 202,
        message: `OrbitDB Node ${config.id} not created`,
        error: new Error(`OrbitDB Node ${config.id} not created`)
    } as INodeActionResponse
}

/**
 * @openapi
 * components:
 *  schemas:
 *   OrbitDBNode:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      description: The System Worker ID of the OrbitDB node
 *      example: "abcd123"
 *     peerID:
 *      type: string
 *      description: The Peer ID of the OrbitDB node
 *      example: "QmXt3Yz8v3Z6"
 *     ipfsWorkerID:
 *      type: string
 *      description: The System Worker ID of the IPFS node
 *      example: "abcd123"
 *     libp2pWorkerID:
 *      type: string
 *      description: The System Worker ID of the libp2p node
 *      example: "abcd123"     
 *     status:
 *      type: string
 *      description: The status of the OrbitDB node
 *      example: "started"
 */

/**
 * @openapi
 * /api/v0/orbitdb/create:
 *  post:
 *   summary: Creates an OrbitDB node
 *   tags:
 *    - orbitdb
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
 *          ipfsWorkerId:
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
router.post('/orbitdb/create', async function(req: OrbitDBCreateRequest, res: Response) {
    const id: OrbitDBNode['id'] = req.body.id;
    const options = req.body.options;
    const ipfsWorker: IPFSNode | INodeActionResponse = ipfsNodesManager.get(options.ipfsWorkerId);

    if (ipfsWorker instanceof IPFSNode) {
        const orbitDbNodeConfig: OrbitDBNodeConfig = new OrbitDBNodeConfig(id, {ipfs: ipfsWorker} as IOrbitDBNodeOptions);
        const orbitDbNode: OrbitDBNode | INodeActionResponse = createNode(orbitDbNodeConfig);
        if (orbitDbNode instanceof OrbitDBNode) {
            res.send(orbitDbNode);
        }
        else {
            res.status(500).send(orbitDbNode);
        }
    }
    else {
        res.status(500).send(ipfsWorker);
    }
});

/**
 * @openapi
 * /api/v0/orbitdb/list:
 *  get:
 *   summary: Returns the list of OrbitDB nodes
 *   tags:
 *    - orbitdb
 *   responses:
 *    200:
 *     description: The list of OrbitDB nodes
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/OrbitDBNode'
 *     example: /or
 */
router.get('/orbitdb/list', async function(req: Request, res: Response) {
    res.send(orbitDbNodesManager.list());
});

/**
 * @openapi
 * /api/v0/orbitdb/remove:
 *  post:
 *   summary: Removes an OrbitDB node
 *   tags:
 *    - orbitdb
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
 *     description: The OrbitDB node
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/OrbitDBNode'
 *     example: /or
 */
router.post('/orbitdb/remove', async function(req: OrbitDBBaseRequest, res: Response) {
    res.send(orbitDbNodesManager.delete(req.body.id));
});

/**
 * @openapi
 * /api/v0/orbitdb/node/start:
 *  post:
 *   summary: Starts an OrbitDB node
 *   tags:
 *    - orbitdb
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
router.post('/orbitdb/node/start', async function(req: OrbitDBBaseRequest, res: Response) {
    const orbitDbNode = activeNode(req.body.id);
    if (orbitDbNode instanceof OrbitDBNode) {
        res.send(await orbitDbNode.start());
    }
    else {
        res.status(500).send(orbitDbNode);
    }
});

export {
    router as orbitdbRouter,
    orbitDbNodesManager
}

/**
 * @openapi
 * /api/v0/orbitdb/node/stop:
 *  post:
 *   summary: Stops an OrbitDB node
 *   tags:
 *    - orbitdb
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
router.post('/orbitdb/node/stop', async function(req: OrbitDBBaseRequest, res: Response) {
    const orbitDbNode = activeNode(req.body.id);
    if (orbitDbNode instanceof OrbitDBNode) {
        res.send(await orbitDbNode.stop());
    }
    else {
        res.status(500).send(orbitDbNode);
    }
});