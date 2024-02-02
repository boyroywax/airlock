'use strict';

import express, { Request, Response, } from 'express';
import { router } from './index.js';
import { OrbitDBNode, OrbitDBNodeOptions, OrbitDBTypes } from '../../models/orbitdb.js';


// const orbitDbOptions: OrbitDBNodeOptions = {
//     databaseName: 'ab1-orbitdb-ipfs-trnkt-xyz',
//     databaseType: OrbitDBTypes.EventLog,
//     enableDID: true
// }

// const odb: OrbitDBNode = new OrbitDBNode(orbitDbOptions);

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
router.get('/api/orbitdb/address', async function(req: Request, res: Response) {
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
router.get('/api/orbitdb/close', async function(req: Request, res: Response) {
    res.send(await odb.closeDb());
})
    
export { orbitdbRouter };