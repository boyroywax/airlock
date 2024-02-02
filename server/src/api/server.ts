import express from 'express';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';


class ApiServerOptions {
    public port: number = 3000;
    public routers: express.Router[] = [];

    public constructor(port: number) {
        this.port = port;
    }
}


class ApiServer {
    public app: express.Application;
    public port: number;
    private routers: express.Router[];

    constructor(
        options?: ApiServerOptions
    ) {
        this.port = options?.port || 3000;
        this.app = express();
        this.routers = options?.routers || [];
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

        this.app.use('/api/docs', swaggerUi.serve)
        this.app.get('/api/docs', swaggerUi.setup(specs, { explorer: true }))

        this.app.use('/', ...this.routers);
    }

    public start() {
        this.init()
        this.app.listen(this.port, () => {
            console.log(`API Server is running on port ${this.port}`);
        })
    }
}

export {
    ApiServer,
    ApiServerOptions
}