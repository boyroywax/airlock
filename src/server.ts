// server.js
import express from 'express';
// import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
// import session from 'express-session';
// import bodyParser from 'body-parser';
// import path from 'path';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { router } from './routes/index.js';
import { orbitdbRouter } from './routes/OrbitDb.js';

const app = express();

// Set up Swagger
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API with Swagger',
            version: '0.0.1',
        },
        servers: [
            {
                url: 'http://0.0.0.0:3000',
                description: 'Development server',
            },
        ],
    },
    // Path to the API docs
    apis: ["./routes/*.js"]
};

const specs = swaggerJsdoc(options);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', router, orbitdbRouter);


/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of your book
 *         author:
 *           type: string
 *           description: The book author
 *         finished:
 *           type: boolean
 *           description: Whether you have finished reading the book
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 *         finished: false
 *         createdAt: 2020-03-10T04:05:06.157Z
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});