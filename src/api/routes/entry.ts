'use strict';

import express, { Request, Response } from 'express';
import { OrbitDBNode, OrbitDBNodeOptions } from '../../models/orbitdb.js';



const orbitDbOptions: OrbitDBNodeOptions = {
    databaseName: 'ab1-orbitdb-ipfs-trnkt-xyz',
    databaseType: 'events',
    enableDID: true
}

const odb: OrbitDBNode = new OrbitDBNode(orbitDbOptions);

const orbitdbRouter = express.Router();

/**
 * @openapi
 * /api/orbitdb/all:
 *  get:
 *   summary: Returns all the data in the OrbitDB
 *   responses:
 *    200:
 *     description: All the data in the OrbitDB
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *     example: /or
 * 
 */
orbitdbRouter.get('/api/orbitdb/all', async function(req: Request, res: Response) {
    res.send(await odb.openDb.all());
})

/**
 * @openapi
 * /api/orbitdb/add:
 *  post:
 *   summary: Adds data to the OrbitDB
 *   requestBody:
 *    description: Data to add to the OrbitDB
 *    required: true
 *    content:
 *     application/text:
 *      schema:
 *       type: string
 *       example: "Hello World!"
 *   responses:
 *    200:
 *     description: The OrbitDB address
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *     example: /or
 *  */
orbitdbRouter.post('/api/orbitdb/add', async function(req: Request, res: Response) {
    const entry = req.body.toString()
    res.send(await odb.openDb.add(entry));
})

/**
 * @openapi
 * /api/orbitdb/put:
 *  post:
 *   summary: Adds data to the OrbitDB
 *   requestBody:
 *    description: Data to add to the OrbitDB
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        data:
 *         type: string
 *       example: {"Hello":"World"}
 *   responses:
 *    200:
 *     description: The OrbitDB address
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *     example: /or
 *  */
orbitdbRouter.post('/api/orbitdb/put', async function(req: Request, res: Response) {
    const entry = req.body
    res.send(await odb.openDb.put(entry));
})

/**
 * @openapi
 * /api/orbitdb/get:
 *  post:
 *   summary: Gets data from the OrbitDB
 *   requestBody:
 *    description: Hash of the data to get from the OrbitDB
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        data:
 *         type: string
 *       example: {"Hello":"World"}
 *   responses:
 *    200:
 *     description: The OrbitDB address
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *     example: /or
 */
orbitdbRouter.post('/api/orbitdb/get', async function(req: Request, res: Response) {
    const hash = req.body
    res.send(await odb.openDb.get(hash));
})


    
export { orbitdbRouter };