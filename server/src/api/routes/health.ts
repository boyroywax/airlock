import { Request, Response } from 'express';
import { router } from './index.js';


/**
 * @openapi
 * /api/hello:
 *  get:
 *   summary: Returns a Hello World message
 *   responses:
 *    200:
 *     description: Hello World!
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *     example: /or
 * 
 */
router.get('/api/hello', function(req: Request, res: Response) {
    res.send('Hello World!');
});

export { router };