import {
    Component,
    LogLevel
} from '../../models/constants.js';

import {
    createRandomId,
    logger
} from '../../utils/index.js';

import {
    BaseWorker, WorkerProcess
} from './worker.js';

import {
    libp2pCommands
} from './commandsLibp2p.js';


/**
 * @interface IBaseCommandProperties
 * @description Base Node Command Properties Interface
 * @member action: string
 * @member call?: any
 * @member args?: Array<string>
 * @member kwargs?: Map<string, string>
 */
interface IBaseCommandProperties {
    action: string;
    call?: any;
    args?: Array<string>;
    kwargs?: Map<string, string>;
}


/**
 * @class BaseCommandProperties
 * @description Base Node Command Properties
 * @implements IBaseCommandProperties
 * @member action: string - The command action
 * @member call?: any - The command call function or object
 * @member args?: Array<string> - The command arguments
 * @member kwargs?: Map<string, string> - The command keyword arguments
 */
class BaseCommandProperties
    implements IBaseCommandProperties
{
    public action: string;
    public call?: any;
    public args?: Array<string>;
    public kwargs?: Map<string, string>; 

    public constructor({
        action,
        call,
        args,
        kwargs
    }: {
        action: string,
        call?: any,
        args?: Array<string>,
        kwargs?: Map<string, string>
    }) {
        this.action = action;
        this.call = call;
        this.args = args ? args : new Array<string>();;
        this.kwargs = kwargs ? kwargs : new Map<string, string>();
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
 * @method verifyArgs(args?: Array<string>, kwargs?: Map<string, string>): boolean
 * @method setOutput(output: IBaseCommandResponse<any>): void
 */
interface IBaseCommand {
    process: BaseCommandProperties;
    processId: string;
    output?: BaseCommandResponse<any>;

    execute(): Promise<BaseCommandResponse<any>>;
    verifyArgs(args?: Array<string>, kwargs?: Map<string, string>): boolean;
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
    public async execute(
        args?: Array<string>,
        kwargs?: Map<string, string>
    ): Promise<BaseCommandResponse<any>> {
        let response: BaseCommandResponse<any> = new BaseCommandResponse<string>('Command Not Implemented');

        this.process.call(this.process.args, this.process.kwargs).then( (result: any) => {
            response = new BaseCommandResponse<typeof result>(result);
        }).catch( (error: Error) => {
            try {
                this.process.call.then( (result: any) => {
                    response = new BaseCommandResponse<typeof result>(result);
                });
            } catch (e: any) {
                logger({
                    level: LogLevel.ERROR,
                    message: `Command ${this.process.action} failed with processId: ${this.processId}\n Error: ${e.message}` +
                            `\n Stack: ${e.stack} \n Output: ${response.output} \n Error: ${error}`
                })
            }
        });

        logger({
            level: LogLevel.INFO,
            message: `Command ${this.process.action} executed with processId: ${this.processId}\n Output: ${response.output}`
        })
        this.setOutput(response);

        return response;
    };

    /**
     * @function verifyArgs
     * @param args?: Array<string>
     * @param kwargs?: Map<string, string>
     * @returns boolean
     * @description Verify the command arguments
     */
    public verifyArgs(
        args?: Array<string>,
        kwargs?: Map<string, string>
     ): Map<string, string> {
        const availableArgs = this.process.args ? this.process.args : new Array<string>();
        const availableKwargs = this.process.kwargs ? this.process.kwargs : new Map<string, string>();

        // check number of arguments passed in
        if (args?.length > availableArgs.length) {
            logger({
                level: LogLevel.ERROR,
                processId: this.processId,
                message: `Command ${this.process.action} failed with processId: ${this.processId}\n Error: Too many arguments`
            })
            return new Map<string, string>();
        }

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

/**
 * @function createBaseCommands
 * @param worker: BaseWorker
 * @param component: Component
 * @returns BaseCommandProperties[]
 * @description Create the base commands for the node instance
 * @summary Create the base commands for the node instance
 */
const createBaseCommands = (
    worker: BaseWorker<WorkerProcess>,
    component: Component,
): BaseCommandProperties[] => {
    let libp2pcmds: BaseCommandProperties[] = [];

    switch (component) {
        case Component.LIBP2P:
            libp2pcmds = libp2pCommands({
                worker: worker.process,
            });
        default:
            break;
    }

    return Array<BaseCommandProperties>(...libp2pcmds);
}






export {
    IBaseCommandResponse,
    BaseCommandResponse,
    IBaseCommand,
    BaseCommand,
    IBaseCommandProperties,
    BaseCommandProperties,
    createBaseCommands
}