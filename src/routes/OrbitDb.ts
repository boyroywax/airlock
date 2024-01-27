'use strict';

/**
 * orbitdb Routes
 * @module routes/orbitds
 * @requires controllers/orbitdb
 */

import express from 'express';
import { OrbitDB } from '../orbitdb/index.js';

const odb: OrbitDB = new OrbitDB();

const orbitdbRouter = express.Router();

/**
 * @swagger
 * /api/orbitdb/address:
 *  get:
 *   summary: Returns the OrbitDB address
 *  responses:
 *  200:
 *  description: The OrbitDB address
 * content:
 * application/json:
 * schema:
 * type: string
 * example: /or
 * 
 */
orbitdbRouter.get('/api/orbitdb/address', async function(req: any, res: any) {
    res.send(odb.openDb.address.toString());
})

/**
 * @swagger
 * /api/orbitdb/all:
 *  get:
 *   summary: Returns all the data in the OrbitDB
 *  responses:
 *  200:
 *  description: All the data in the OrbitDB
 * content:
 * application/json:
 * schema:
 * type: string
 * example: /or
 * 
 */
orbitdbRouter.get('/api/orbitdb/all', async function(req: any, res: any) {
    res.send(await odb.openDb.all());
})
    
export { orbitdbRouter };