import {
    BaseNodeStatus,
    BaseNodeStatuses
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

interface IBaseNodeCommandPlane<T> {
    commands: IBaseNodeCommandActions;
    worker: T;

    run(command: IBaseNodeCommand): IBaseNodeResponse;
}

class BaseNodeCommandPlane<T>
    implements IBaseNodeCommandPlane<T>
{
    public commands: BaseNodeCommandActions;
    public worker: T;

    public constructor(
        worker: T,
        commands?: BaseNodeCommandActions | BaseNodeCommand[]
    ) {
        this.worker = worker;
        this.commands = commands ? new BaseNodeCommandActions([]) : new BaseNodeCommandActions(commands=[]);
    }

    public run(command: BaseNodeCommand): BaseNodeResponse {
        // Execute the Command
        this.execute(command);

        return command.output as BaseNodeResponse;
    }

    private execute = async (command: BaseNodeCommand): Promise<void> => {
        switch (command.process.action) {
            default:
                command.setOutput(new BaseNodeResponse(
                    400,
                    new BaseNodeStatus(BaseNodeStatuses.ERROR, 'Command Not Found')
                ));
                break;
        }
    }
}

export {
    IBaseNodeCommandActions,
    BaseNodeCommandActions,
    IBaseNodeCommandOption,
    BaseNodeCommandOption,
    BaseNodeCommand,
    IBaseNodeCommandPlane,
    BaseNodeCommandPlane
}