import { IBaseNodeId, BaseNodeId } from './node.js';
import { IBaseNodeResponse, BaseNodeResponse } from './responses.js';


enum BaseNodeCommandAction {
    CREATE = 'create',
    GET = 'get',
    UPDATE = 'update',
    DELETE = 'delete',
    LIST = 'list',
    ADD = 'add',
}

interface IBaseNodeCommandOptions {
    action: BaseNodeCommandAction;
    args: string[];
    kwargs: {};
}

class BaseNodeCommandOptions implements IBaseNodeCommandOptions {
    public action: BaseNodeCommandAction;
    public args: string[];
    public kwargs: {};

    public constructor(
        action: BaseNodeCommandAction,
        args: string[] = [],
        kwargs: {} = {}
    ) {
        this.action = action;
        this.args = args;
        this.kwargs = kwargs;
    }
}

interface IBaseNodeCommand<T> {
    command: BaseNodeCommandOptions;
    output?: BaseNodeResponse<T>;

    setOutput(output: BaseNodeResponse<T>): void;
}

class BaseNodeCommand<T> implements IBaseNodeCommand<T> {
    public command: BaseNodeCommandOptions;
    public output?: BaseNodeResponse<T>;

    public constructor(
        command: BaseNodeCommandOptions
    ) {
        this.command = command;
    }

    public setOutput(output: BaseNodeResponse<T>): void {
        this.output = output;
    }

}

interface IBaseNodeCommandPlane<T> {
    commands: Map<BaseNodeCommandAction, IBaseNodeCommand<T>>;

    addCommand(command: IBaseNodeCommand<T>): void;
    execute(command: IBaseNodeCommand<T>): void;
}

class BaseNodeCommandPlane<T> implements IBaseNodeCommandPlane<T> {
    public commands: Map<BaseNodeCommandAction, BaseNodeCommand<T>>;

    public constructor(
        availableCommands: BaseNodeCommandAction[] = []
    ) {
        this.commands = this.initCommands(availableCommands) ? this.initCommands(availableCommands) : new Map();
    }

    private initCommands(
        commands: BaseNodeCommandAction[]
    ): Map<BaseNodeCommandAction, BaseNodeCommand<T>> {
        let availableCommands = new Map<BaseNodeCommandAction, BaseNodeCommand<T>>();

        commands.forEach((command) => {
            availableCommands.set(command, new BaseNodeCommand<T>(new BaseNodeCommandOptions(command)));
        });

        return availableCommands;
    }

    public addCommand(command: BaseNodeCommand<T>): void {
        this.commands.set(command.command.action, command);
    }

    public execute(command: BaseNodeCommand<T>): void {
        
    }
}

export {
    BaseNodeCommandAction,
    IBaseNodeCommandOptions,
    BaseNodeCommandOptions,
    BaseNodeCommand,
    IBaseNodeCommandPlane,
    BaseNodeCommandPlane
}