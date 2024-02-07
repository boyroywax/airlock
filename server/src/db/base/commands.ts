import { INodeCommandResponse } from '../../models/index.js';
import { BaseNodeStatus, BaseNodeStatuses } from './node.js';
import { BaseNodeResponse, BaseNodeResponseObject, IBaseNodeResponse } from './responses.js';


interface IBaseNodeCommandActions extends Object{
    readonly actions: string[]
}

class BaseNodeCommandActions implements IBaseNodeCommandActions {
    public actions: string[];

    public constructor(
        actions: string[] = []
    ) {
        this.actions = actions;
    }
}

interface IBaseNodeCommandOptions<T> {
    worker: T;
    action: string;
    args: string[];
    kwargs: {};
}

class BaseNodeCommandOptions<T>
    implements IBaseNodeCommandOptions<T>
{
    public worker: T;
    public action: string;
    public args: string[];
    public kwargs: {};

    public constructor(
        worker?: T,
        action: string,
        args?: string[],
        kwargs?: {}
    ) {
        this.worker = worker ? worker : {} as T;
        this.action = action;
        this.args = args ? args : [];
        this.kwargs = kwargs ? kwargs : {};
    }
}

interface IBaseNodeCommand<T> {
    process: BaseNodeCommandOptions<T>;
    output?: BaseNodeResponse;

    setOutput(output: BaseNodeResponse): void;
}

class BaseNodeCommand<T> implements IBaseNodeCommand<T> {
    public process: BaseNodeCommandOptions<T>;
    public output?: BaseNodeResponse;

    public constructor(
        command: BaseNodeCommandOptions<T>
    ) {
        this.process = command;
    }

    public setOutput(output: BaseNodeResponse): void {
        this.output = output;
    }

}

interface IBaseNodeCommandPlane<T> {
    commands: Map<string, IBaseNodeCommand<T>>;

    addCommand(command: IBaseNodeCommand<T>): void;
    execute(command: IBaseNodeCommand<T>: IBaseNodeResponse;
}

class BaseNodeCommandPlane<T> implements IBaseNodeCommandPlane<T> {
    public commands: Map<string, BaseNodeCommand<T>>;

    public constructor(
        availableCommands?: BaseNodeCommandActions
    ) {
        const commands = availableCommands ?
            availableCommands : new BaseNodeCommandActions();
        this.commands = this.initCommands(commands);
    }

    private initCommands(
        commands: IBaseNodeCommandActions
    ): Map<string, BaseNodeCommand<T>> {
        let availableCommands = new Map<string, BaseNodeCommand<T>>();

        commands.actions.forEach((command) => {
            availableCommands.set(command, new BaseNodeCommand<T>(
                new BaseNodeCommandOptions<T>(
                    {} as T,
                    command,
                    [],
                    {}
                )
            ));
        });

        return availableCommands;
    }

    public addCommand(command: BaseNodeCommand<T>): void {
        this.commands.set(command.process.action, command);
    }

    public execute(command: BaseNodeCommand<T>): BaseNodeResponse {
        const worker: T = command.process.worker;
        const action: string = command.process.action;

        // Execute the Command
        // ...

        // Set the output of the command
        command.setOutput(new BaseNodeResponse(
            200,
            new BaseNodeStatus(BaseNodeStatuses.STARTED, 'Command Executed')
        ));

        return command.output as BaseNodeResponse;
    }

        
}

export {
    IBaseNodeCommandActions,
    BaseNodeCommandActions,
    IBaseNodeCommandOptions,
    BaseNodeCommandOptions,
    BaseNodeCommand,
    IBaseNodeCommandPlane,
    BaseNodeCommandPlane
}