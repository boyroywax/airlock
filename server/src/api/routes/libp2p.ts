import express, { Response, Request, response } from 'express';   

import { Libp2pNode, Libp2pNodeConfig, Libp2pNodesManager, createLibp2pManager } from '../../db/libp2p/index.js';
import { Libp2pBaseRequest, Libp2pCommandRequest, Libp2pCommandResponse } from '../../models/api.js';
import { INodeActionResponse, INodeCommandResponse } from '../../models/node.js';
import { Libp2pNodeCommand, Libp2pNodeCommandPlane } from '../../db/libp2p/commands.js';

const router = express.Router();

const libp2pNodesManager: Libp2pNodesManager = createLibp2pManager();

/**
 * @constant activeNode
 * @param id : Libp2pNode['id'] | string
 * @returns : Libp2pNode | INodeActionResponse
 * @description Returns the active libp2p node instance
 * @summary This function returns the active libp2p node instance,
 *          if the node is not found, it will return an error
 */
const activeNode = (id: Libp2pNode['id']): Libp2pNode | INodeActionResponse => {
    return libp2pNodesManager.get(id);
}

/**
 * @openapi
 * components:
 *  schemas:
 *   Libp2pNode:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      description: The System Worker ID of the libp2p node
 *      example: "abcd123"
 *     peerID:
 *      type: string
 *      description: The Peer ID of the libp2p node
 *      example: "QmXt3Yz8v3Z6"
 *     status:
 *      type: string
 *      description: The status of the libp2p node
 *      example: "started"
 */

/**
 * @openapi
 * /api/v0/libp2p/create:
 *  post:
 *   summary: Creates a libp2p node
 *   tags:
 *    - libp2p
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
 * /api/v0/libp2p/list:
 *  get:
 *   summary: Lists all libp2p nodes
 *   tags:
 *    - libp2p
 *   responses:
 *    200:
 *     description: The result of the operation
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         libp2pNode: string
 *     example: /or
 *  */
router.get('/libp2p/list', async (req: Request, res: Response) => {
    res.send(libp2pNodesManager.list());
});


/**
 * @openapi
 * /api/v0/libp2p/remove:
 *  post:
 *   summary: Removes a libp2p node
 *   tags:
 *    - libp2p
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
router.post('/libp2p/remove', (req: Libp2pBaseRequest, res: Response) => {
    res.send(libp2pNodesManager.delete(req.body.id));
});

/**
 * @openapi
 * /api/v0/libp2p/node/id:
 *  post:
 *   summary: Returns the Peer ID of a libp2p node
 *   tags:
 *    - libp2p
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
router.post('/libp2p/node/id', (req: Libp2pBaseRequest, res: Response) => {
    const libp2pNodeResponse = activeNode(req.body.id);
    if (libp2pNodeResponse instanceof Libp2pNode) {
        res.send(libp2pNodeResponse.getPeerID());
    } 
    else {
        res.send(libp2pNodeResponse);
    }
});


/**
 * @openapi
 * /api/v0/libp2p/node/status:
 *  post:
 *   summary: Returns the status of a libp2p node
 *   tags:
 *    - libp2p
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
router.post('/libp2p/node/status', (req: Libp2pBaseRequest, res: Response) => {
    const libp2pNodeResponse = activeNode(req.body.id);
    if (libp2pNodeResponse instanceof Libp2pNode) {
        res.send(libp2pNodeResponse.getStatus());
    }
    else {
        res.send(libp2pNodeResponse);
    }
});

/**
 * @openapi
 * /api/v0/libp2p/node/start:
 *  post:
 *   summary: Starts a libp2p node
 *   tags:
 *    - libp2p
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
    const libp2pNodeResponse = activeNode(req.body.id);
    if (libp2pNodeResponse instanceof Libp2pNode) {
        if (libp2pNodeResponse.getStatus().message === 'started') {
            res.send({
                code: 104,
                message: `Libp2p ${req.body.id} Node is already started`
            } as INodeActionResponse);
        }
        else {
            res.send(await libp2pNodeResponse.start());
        }
    }
    else {
        res.send(libp2pNodeResponse);
    }
});

/**
 * @openapi
 * /api/v0/libp2p/node/stop:
 *  post:
 *   summary: Stops a libp2p node
 *   tags:
 *    - libp2p
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
    const libp2pNodeResponse = activeNode(req.body.id);
    if (libp2pNodeResponse instanceof Libp2pNode) {
        if (libp2pNodeResponse.getStatus().message === 'started') {
            res.send(await libp2pNodeResponse.stop());
        }
        else {
            res.send({
                code: 104,
                message: `Libp2p ${req.body.id} Node is not started`
            } as INodeActionResponse);
        }
    }
    else {
        res.send(libp2pNodeResponse);
    }
});

/**
 * @openapi
 * /api/v0/libp2p/node/command:
 *  post:
 *   summary: Runs a command on a libp2p node instance
 *   tags:
 *    - libp2p
 *   requestBody:
 *    description: Node ID and Command to run - listConnections, dial, listAddrs, dialProtocol, hangUp, closeConnection
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        id:
 *         type: string
 *         example: "abcd123"
 *        command:
 *         type: string
 *         example: "listConnections"
 *        args:
 *         type: array
 *         items:
 *          args: string
 *         example: ["arg1", "arg2"]
 *   responses:
 *    200:
 *     description: The result of the operation
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *     example: /or
 *  */
router.post('/libp2p/node/command', async (req: Libp2pCommandRequest, res: Response ) => {
    const libp2pNodeResponse = activeNode(req.body.id);
    if (libp2pNodeResponse instanceof Libp2pNode) {
        res.send(await libp2pNodeResponse.runCommand(req.body.command, req.body.args));
    }
    else {
        res.send(libp2pNodeResponse);
    }
});

export {
    router as libp2pRouter,
    libp2pNodesManager
}
