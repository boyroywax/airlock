import {
    createRandomId
} from '../../utils/index.js';

import {
    BaseNodeStatus,
    BaseNodeStatuses,
    BaseNodeWorker,
    IBaseNodeWorker
} from './node.js';

import {
    BaseNodeResponse,
    BaseNodeResponseObject,
    IBaseNodeResponse
} from './responses.js';



interface IBaseNodeCommandPlane<T, U> {
    commands: IBaseNodeCommands;
    worker: IBaseNodeWorker<T, U>;

    run(processId: IBaseNodeCommand['processId']): Promise<IBaseNodeResponse<any>>;
    execute(command: IBaseNodeCommand): Promise<BaseNodeResponse<any>>;
}

class BaseNodeCommandPlane<T, U>
    implements IBaseNodeCommandPlane<T, U>
{
    public commands: BaseNodeCommands;
    public worker: BaseNodeWorker<T, U>;

    public constructor(
        worker: BaseNodeWorker<T, U>,
        commands?: BaseNodeCommands | BaseNodeCommand[]
    ) {
        this.worker = worker;
        if (commands instanceof BaseNodeCommands) {
            this.commands = commands;
        }
        else {
            this.commands = new BaseNodeCommands(commands? commands : []);
        }
    }

    public async run(processId: BaseNodeCommand['processId']): Promise<BaseNodeResponse<any>> {

        const command = this.commands.commands.get(processId);

        if (!command) {
            return new BaseNodeResponse<any>(
                400,
                new BaseNodeStatus(BaseNodeStatuses.ERROR, 'Command Not Found')
            );
        }
        // Execute the Command
        this.execute(command).then ( (response) => {
            command.setOutput(response as BaseNodeResponse<any>);
        });

        return command.output as BaseNodeResponse<any>;
    }

    public execute = async (command: BaseNodeCommand): Promise<BaseNodeResponse<any>> => {
        let response: BaseNodeResponse<any> = new BaseNodeResponse(
            400,
            new BaseNodeStatus(BaseNodeStatuses.ERROR, 'Command Not Found')
        );

        switch (command.process.action) {
            default:
                response = new BaseNodeResponse(
                    400,
                    new BaseNodeStatus(BaseNodeStatuses.ERROR, 'Command Not Found')
                );
                break;
        }
        return response;
    }
}

export {
    IBaseNodeCommands as IBaseNodeCommandActions,
    BaseNodeCommands as BaseNodeCommandActions,
    IBaseNodeCommandProperties as IBaseNodeCommandOption,
    BaseNodeCommandProperties as BaseNodeCommandOption,
    IBaseNodeCommand,
    BaseNodeCommand,
    IBaseNodeCommandPlane,
    BaseNodeCommandPlane
}