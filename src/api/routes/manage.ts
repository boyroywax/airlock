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
 * /api/orbitdb/address:
 *  get:
 *   summary: Returns the OrbitDB address
 *   responses:
 *    200:
 *     description: The OrbitDB address
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *     example: /or
 * 
 */
orbitdbRouter.get('/api/orbitdb/address', async function(req: Request, res: Response) {
    res.send(await odb.openDb.address.toString());
})

/**
 * @openapi
 * /api/orbitdb/close:
 *  get:
 *   summary: Closes the OrbitDB
 *   responses:
 *    200:
 *     description: The OrbitDB address
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *     example: /or
 * 
 */
orbitdbRouter.get('/api/orbitdb/close', async function(req: Request, res: Response) {
    res.send(await odb.closeDb());
})
    
export { orbitdbRouter };