import express, { Response, Request } from 'express';   

import { Libp2pNode, Libp2pNodeConfig, Libp2pNodesManager } from '../../db/libp2p/index.js';
import { Libp2pBaseRequest } from '../../models/api.js';

const router = express.Router();

const libp2pNodesManager = new Libp2pNodesManager();

const activeNode = (id: Libp2pNode['id']) => {
    const active = libp2pNodesManager.get(id);

    if (active instanceof Libp2pNode) {
        return active;
    } else {
        throw new Error('Node not found');
    }
}

/**
 * @openapi
 * /api/v0/libp2p/create:
 *  post:
 *   summary: Creates a libp2p node
 *   requestBody:
 *    description: Node ID
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
 *  */
router.post('/libp2p/create', (req: Libp2pBaseRequest, res: Response) => {
    const libp2pNodeConfig: Libp2pNodeConfig = {
      id: req.body.id,
    }
    res.send(libp2pNodesManager.create(libp2pNodeConfig));
});


/**
 * @openapi
 * /api/v0/libp2p/node/start:
 *  post:
 *   summary: Starts a libp2p node
 *   requestBody:
 *    description: Node ID
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
 *  */
router.post('/libp2p/node/start', async (req: Libp2pBaseRequest, res: Response) => {
    const libp2pNode = activeNode(req.body.id);
    res.send(await libp2pNode.start());
});

/**
 * @openapi
 * /api/v0/libp2p/node/stop:
 *  post:
 *   summary: Stops a libp2p node
 *   requestBody:
 *    description: Node ID
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
 *  */
router.post('/libp2p/node/stop', async (req: Libp2pBaseRequest, res: Response) => {
    const libp2pNode = activeNode(req.body.id);
    res.send(await libp2pNode.stop());
});

export {
    router as libp2pRouter
}
