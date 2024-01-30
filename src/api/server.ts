import express from 'express';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { router } from './routes/index.js';
import { orbitdbRouter } from './routes/manage.js';


export class ApiServer {
    public app: express.Application;
    private defaultPort = 3000;

    constructor() {
        this.app = express();
    }

    public init() {

        const options = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'OrbitDB API',
                    version: '0.0.1',
                },
                servers: [
                    {
                        url: 'http://0.0.0.0:3000',
                        description: 'Development server',
                    },
                ],
                consumes: ['application/json'],
                produces: ['application/json']
                // host: url, // Host (optional)
            },
            // Path to the API docs
            apis: [
                './src/routes/*.ts',
                './src/models/*.ts',
                './dist/routes/*.js',
                './dist/models/*.js'
            ]
        };

        const specs = swaggerJsdoc(options);

        this.app.use(express.json());

        router.use('/api/docs', swaggerUi.serve)
        router.get('/api/docs', swaggerUi.setup(specs, { explorer: true }))

        this.app.use('/', router, orbitdbRouter);
    }

    public start(port: number = this.defaultPort) {
        this.init()
        this.app.listen(port, () => {
            console.log(`API Server is running on port ${port}`);
        })
    }
}