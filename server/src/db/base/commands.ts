import {
    createRandomId
} from '../../utils/index.js';

import {
    BaseStatus,
    BaseStatuses
} from './node.js';

import {
    BaseResponse,
} from './responses.js';

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
 * @interface IBaseCommand
 * @description Base Node Command Interface
 * @member process: IBaseCommandProperties
 * @member processId?: string
 * @member output?: IBaseResponse<any>
 * @method execute(): Promise<IBaseResponse<any>>
 * @method setOutput(output: IBaseResponse<any>): void
 */
interface IBaseCommand {
    process: BaseCommandProperties;
    processId: string;
    output?: BaseResponse<any>;

    execute(): Promise<BaseResponse<any>>;
    setOutput(output: BaseResponse<any>): void;
}

/**
 * @class BaseCommand
 * @description Base Node Command
 * @implements IBaseCommand
 * @member process: BaseCommandProperties - The command, action, and arguments
 * @member processId?: string - The process ID
 * @member output?: BaseResponse<any> - The command output
 * @method execute(): Promise<BaseResponse<any>> - Execute the command
 * @method setOutput(output: BaseResponse<any>): void - Set the command output
 */
class BaseCommand
    implements IBaseCommand
{
    public process: BaseCommandProperties;
    public processId: string;
    public output?: BaseResponse<any>;

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
    public async execute(): Promise<BaseResponse<any>> {
        let response: BaseResponse<any> = new BaseResponse(
            400,
            new BaseStatus(BaseStatuses.ERROR, 'Command Not Found')
        );

        this.process.call(this.process.args, this.process.kwargs).then( (result: any) => {
            response = new BaseResponse(
                200,
                new BaseStatus(BaseStatuses.DONE, 'Command Executed', result)
            );
        }).catch( (error: Error) => {
            response = new BaseResponse(
                500,
                new BaseStatus(BaseStatuses.ERROR, 'Command Failed', error)
            );
        });
        return response;
    }

    /**
     * @function setOutput
     * @param output: BaseResponse<any>
     * @description Set the command output
     */
    public setOutput(output: BaseResponse<any>): void {
        this.output = output;
    }
}

export {
    IBaseCommand,
    BaseCommand,
    IBaseCommandProperties,
    BaseCommandProperties,
}