import express from 'express';

const router = express.Router();

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
router.get('/api/hello', function(req: any, res: any) {
    res.send('Hello World!');
});

export { router };