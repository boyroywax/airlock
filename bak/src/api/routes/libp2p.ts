import express, { Response, Request, response } from 'express'; 
import { initDefaultLibp2pNode, Libp2pNode, Libp2pNodesManager, BaseNodeResponse, BaseNodeResponseCode, Libp2pNodeCreateOptions } from '../../db/index.js';
import { BaseNodeId, BaseNodeStatus, BaseNodeStatuses } from '../../db/base/node.js';
import { Libp2pBaseRequest, Libp2pCommandRequest } from '../../models/api.js';
import { BaseNodeCommand, BaseNodeCommandOption } from '../../db/base/commands.js';



const router = express.Router();

const libp2pNodesManager: Libp2pNodesManager = initDefaultLibp2pNode();

/**
 * @constant activeNode
 * @param id : Libp2pNode['id'] | string
 * @returns : Libp2pNode | INodeActionResponse
 * @description Returns the active libp2p node instance
 * @summary This function returns the active libp2p node instance,
 *          if the node is not found, it will return an error
 */
const activeNode = async (id: Libp2pNode['id']): Promise<Libp2pNode | BaseNodeResponse> => {
    const libp2pNode = libp2pNodesManager.get(id);
    if (libp2pNode instanceof Libp2pNode) {
        return libp2pNode;
    }
    else {
        return new BaseNodeResponse(
            BaseNodeResponseCode.NOT_FOUND,
            new BaseNodeStatus(
                BaseNodeStatuses.ERROR,
                `Libp2p Node ${id} not found`,
                new Error(`Libp2p Node ${id} not found`)
            ),
        );
    }

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
    const libp2pNodeConfig: Libp2pNodeCreateOptions = new Libp2pNodeCreateOptions({
      id: req.body.id,
    });
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
    res.send(libp2pNodesManager.delete(new BaseNodeId(req.body.id)));
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
router.post('/libp2p/node/id', async (req: Libp2pBaseRequest, res: Response) => {
    const libp2pNodeResponse = await activeNode(new BaseNodeId(req.body.id));
    if (libp2pNodeResponse instanceof Libp2pNode) {
        res.send(libp2pNodeResponse.commands.run('id'));
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
    const libp2pNodeResponse = activeNode(new BaseNodeId(req.body.id));
    if (libp2pNodeResponse instanceof Libp2pNode) {
        res.send(libp2pNodeResponse.commands.run('getStatus'));
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
    const libp2pNodeResponse = activeNode(new BaseNodeId(req.body.id));
    let response: BaseNodeResponse<string> | undefined;

    if (libp2pNodeResponse instanceof Libp2pNode) {
        const currentStatus = libp2pNodeResponse.commands.run('getStatus');
        if ( currentStatus.output?.object === 'started') {
            response = new BaseNodeResponse(
                BaseNodeResponseCode.SUCCESS,
                new BaseNodeStatus(
                    BaseNodeStatuses.DONE,
                    `Libp2p Node ${req.body.id} is already started`
                )
            );
        }
        else {
            libp2pNodeResponse.commands.run('start');
            response = new BaseNodeResponse(
                BaseNodeResponseCode.SUCCESS,
                new BaseNodeStatus(
                    BaseNodeStatuses.DONE,
                    `Libp2p Node ${req.body.id} started`
                )
            );
        }
    }
    res.send(response ? response : libp2pNodeResponse);
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
    const libp2pNodeResponse = activeNode(new BaseNodeId(req.body.id));
    let response: BaseNodeResponse<string> | undefined;

    if (libp2pNodeResponse instanceof Libp2pNode) {
        const currentStatus = libp2pNodeResponse.commands.run('getStatus');
        if ( currentStatus.output?.object === 'stopped') {
            response = new BaseNodeResponse(
                BaseNodeResponseCode.SUCCESS,
                new BaseNodeStatus(
                    BaseNodeStatuses.DONE,
                    `Libp2p Node ${req.body.id} is already stopped`
                )
            );
        }
        else {
            libp2pNodeResponse.commands.run('stop');
            response = new BaseNodeResponse(
                BaseNodeResponseCode.SUCCESS,
                new BaseNodeStatus(
                    BaseNodeStatuses.DONE,
                    `Libp2p Node ${req.body.id} stopped`
                )
            );
        }
    }
    res.send(response ? response : libp2pNodeResponse);
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
    const libp2pNodeResponse = activeNode(new BaseNodeId(req.body.id));
    let response: BaseNodeResponse<string> | undefined;

    if (libp2pNodeResponse instanceof Libp2pNode) {
        const args: string[] = req.body.args ? req.body.args : [];
        const command = new BaseNodeCommand(
            new BaseNodeCommandOption(
                req.body.command,
                args
            )
        )

        response = await libp2pNodeResponse.commands.execute(command);
    }
    res.send(response ? response : libp2pNodeResponse);
});


export {
    router as libp2pRouter,
    libp2pNodesManager
}
