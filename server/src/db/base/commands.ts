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


interface IBaseNodeCommandActions
    extends Object
{
    actions: Map<IBaseNodeCommand['processId'], IBaseNodeCommand>;

    add(action: IBaseNodeCommand): void;
    remove(processId: IBaseNodeCommand['processId']): void;
    all(): IBaseNodeCommand[];
}

class BaseNodeCommandActions
    implements IBaseNodeCommandActions
{
    public actions: Map<BaseNodeCommand['processId'], BaseNodeCommand>;

    public constructor(
        actions: BaseNodeCommand[]
    ) {
        this.actions = new Map<BaseNodeCommand['processId'], BaseNodeCommand>();

        for (let action of actions) {
            this.add(action);
        }

    }

    public add(action: BaseNodeCommand): void {
        this.actions.set(action.processId, action);
    }

    public remove(processId: BaseNodeCommand['processId']): void {
        this.actions.delete(processId);
    }

    public all(): BaseNodeCommand[] {
        return Array.from(this.actions.values());
    }
}

interface IBaseNodeCommandOption {
    action: string;
    args: string[];
    kwargs: {};
}

class BaseNodeCommandOption
    implements IBaseNodeCommandOption
{
    public action: string;
    public args: string[];
    public kwargs: {};

    public constructor(
        action: string,
        args?: string[],
        kwargs?: {}
    ) {
        this.action = action;
        this.args = args ? args : [];
        this.kwargs = kwargs ? kwargs : {};
    }
}

interface IBaseNodeCommand {
    processId: string;
    process: BaseNodeCommandOption;
    output?: BaseNodeResponse;

    setOutput(output: BaseNodeResponse): void;
}

class BaseNodeCommand
    implements IBaseNodeCommand
{
    public processId: string;
    public process: BaseNodeCommandOption;
    public output?: BaseNodeResponse;

    public constructor(
        command: BaseNodeCommandOption,
        processId?: string,
    ) {
        this.processId = processId ? processId : '0';
        this.process = command;
    }

    public setOutput(output: BaseNodeResponse): void {
        this.output = output;
    }

}

interface IBaseNodeCommandPlane<T, U> {
    commands: IBaseNodeCommandActions;
    worker: IBaseNodeWorker<T, U>;

    run(processId: IBaseNodeCommand['processId']): IBaseNodeResponse;
    execute(command: IBaseNodeCommand): Promise<BaseNodeResponse>;
}

class BaseNodeCommandPlane<T, U>
    implements IBaseNodeCommandPlane<T, U>
{
    public commands: BaseNodeCommandActions;
    public worker: BaseNodeWorker<T, U>;

    public constructor(
        worker: BaseNodeWorker<T, U>,
        commands?: BaseNodeCommandActions | BaseNodeCommand[]
    ) {
        this.worker = worker;
        this.commands = commands ? new BaseNodeCommandActions([]) : new BaseNodeCommandActions(commands? commands : []);
    }

    public run(processId: BaseNodeCommand['processId']): BaseNodeResponse {

        const command = this.commands.actions.get(processId);

        if (!command) {
            return new BaseNodeResponse(
                400,
                new BaseNodeStatus(BaseNodeStatuses.ERROR, 'Command Not Found')
            );
        }
        // Execute the Command
        this.execute(command).then ( (response) => {
            command.setOutput(response as BaseNodeResponse);
        });

        return command.output as BaseNodeResponse;
    }

    public execute = async (command: BaseNodeCommand): Promise<BaseNodeResponse> => {
        let response: BaseNodeResponse = new BaseNodeResponse(
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
    IBaseNodeCommandActions,
    BaseNodeCommandActions,
    IBaseNodeCommandOption,
    BaseNodeCommandOption,
    IBaseNodeCommand,
    BaseNodeCommand,
    IBaseNodeCommandPlane,
    BaseNodeCommandPlane
}