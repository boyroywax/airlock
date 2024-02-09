import {
    LogLevel
} from '../../models/constants.js';

import {
    createRandomId,
    logger
} from '../../utils/index.js';


/**
 * @interface IBaseCommandProperties
 * @description Base Node Command Properties Interface
 * @member action: string
 * @member call: any
 * @member args: string[]
 * @member kwargs: {}
 */
interface IBaseCommandProperties {
    action: string;
    call: any;
    args: string[];
    kwargs: Object;
}


/**
 * @class BaseCommandProperties
 * @description Base Node Command Properties
 * @implements IBaseCommandProperties
 * @member action: string - The command action
 * @member call: any - The command call function or object
 * @member args: string[] - The command arguments
 * @member kwargs: {} - The command keyword arguments
 */
class BaseCommandProperties
    implements IBaseCommandProperties
{
    public action: string;
    public call: any;
    public args: string[];
    public kwargs: Object; 

    public constructor(
        action: string,
        call: any,
        args?: string[],
        kwargs?: Object
    ) {
        this.action = action;
        this.call = call;
        this.args = args ? args : [];
        this.kwargs = kwargs ? kwargs : Object;
    }
}


/**
 * @interface IBaseCommandResponse
 * @description Base Node Command Response Interface
 * @member output: T
 */
interface IBaseCommandResponse<T> {
    output: T;
}


/**
 * @class BaseCommandResponse
 * @description Base Node Command Response
 * @implements IBaseCommandResponse
 * @member output: T - The command output
 */
class BaseCommandResponse<T>
    implements IBaseCommandResponse<T>
{
    public output: T;

    public constructor(output: T) {
        this.output = output;
    }
}


/**
 * @interface IBaseCommand
 * @description Base Node Command Interface
 * @member process: IBaseCommandProperties
 * @member processId?: string
 * @member output?: IBaseResponse<any>
 * @method execute(): Promise<IBaseCommandResponse<any>>
 * @method setOutput(output: IBaseCommandResponse<any>): void
 */
interface IBaseCommand {
    process: BaseCommandProperties;
    processId: string;
    output?: BaseCommandResponse<any>;

    execute(): Promise<BaseCommandResponse<any>>;
    setOutput(output: BaseCommandResponse<any>): void;
}


/**
 * @class BaseCommand
 * @description Base Node Command
 * @implements IBaseCommand
 * @member process: BaseCommandProperties - The command, action, and arguments
 * @member processId?: string - The process ID
 * @member output?: BaseCommandResponse<any> - The command output
 * @method execute(): Promise<BasecommandResponse<any>> - Execute the command
 * @method setOutput(output: BaseCommandResponse<any>): void - Set the command output
 */
class BaseCommand
    implements IBaseCommand
{
    public process: BaseCommandProperties;
    public processId: string;
    public output?: BaseCommandResponse<any>;

    public constructor(
        command: BaseCommandProperties,
        processId?: string,
    ) {
        this.processId = processId ? processId : createRandomId();
        this.process = command;
    }

    /**
     * @function execute
     * @returns Promise<BaseResponse<any>>
     * @description Execute the command
     */
    public async execute(): Promise<BaseCommandResponse<any>> {
        let response: BaseCommandResponse<any> = new BaseCommandResponse<string>('Command Not Implemented');

        this.process.call(this.process.args, this.process.kwargs).then( (result: any) => {
            response = new BaseCommandResponse<typeof result>(result);
        }).catch( (error: Error) => {
            response = new BaseCommandResponse<any>(error);
        });

        logger({
            level: LogLevel.INFO,
            message: `Command ${this.process.action} executed with processId: ${this.processId}\n Output: ${response.output}`
        })
        this.setOutput(response);

        return response;
    }

    /**
     * @function setOutput
     * @param output: BaseCommandResponse<any>
     * @description Set the command output
     */
    public setOutput(output: BaseCommandResponse<any>): void {
        this.output = output;
    }
}

export {
    IBaseCommandResponse,
    BaseCommandResponse,
    IBaseCommand,
    BaseCommand,
    IBaseCommandProperties,
    BaseCommandProperties,
}