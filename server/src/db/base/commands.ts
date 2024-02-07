import { BaseNodeResponse } from './responses.js';


interface IBaseNodeCommandActions extends Object{
    actions: string[]
}

class BaseNodeCommandActions implements IBaseNodeCommandActions {
    public actions: string[];

    public constructor(
        actions: string[] = []
    ) {
        this.actions = actions;
    }
}

interface IBaseNodeCommandOptions {
    action: string;
    args: string[];
    kwargs: {};
}

class BaseNodeCommandOptions implements IBaseNodeCommandOptions {
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
    command: BaseNodeCommandOptions;
    output?: BaseNodeResponse;

    setOutput(output: BaseNodeResponse): void;
}

class BaseNodeCommand implements IBaseNodeCommand {
    public command: BaseNodeCommandOptions;
    public output?: BaseNodeResponse;

    public constructor(
        command: BaseNodeCommandOptions
    ) {
        this.command = command;
    }

    public setOutput(output: BaseNodeResponse): void {
        this.output = output;
    }

}

interface IBaseNodeCommandPlane {
    commands: Map<string, IBaseNodeCommand>;

    addCommand(command: IBaseNodeCommand): void;
    execute(command: IBaseNodeCommand): void;
}

class BaseNodeCommandPlane implements IBaseNodeCommandPlane {
    public commands: Map<string, BaseNodeCommand>;

    public constructor(
        availableCommands?: BaseNodeCommandActions
    ) {
        const commands = availableCommands ? availableCommands : new BaseNodeCommandActions();
        this.commands = this.initCommands(commands);
    }

    private initCommands(
        commands: IBaseNodeCommandActions
    ): Map<string, BaseNodeCommand> {
        let availableCommands = new Map<string, BaseNodeCommand>();

        commands.actions.forEach((command) => {
            availableCommands.set(command, new BaseNodeCommand(
                new BaseNodeCommandOptions(command)
            ));
        });

        return availableCommands;
    }

    public addCommand(command: BaseNodeCommand): void {
        this.commands.set(command.command.action, command);
    }

    public execute(command: BaseNodeCommand): void {
        
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