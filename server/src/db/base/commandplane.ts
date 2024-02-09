import {
    IBaseCommand,
    BaseCommand,
    IBaseCommandProperties,
    BaseCommandProperties,
} from "./commands.js";

import {
    IBaseWorker,
    BaseWorker
} from "./worker.js";

import {
    logger
} from '../../utils/index.js';
import { LogLevel, ResponseCode } from "../../models/constants.js";


/**
 * @interface IBaseCommandPlane
 * @description Base Node Command Plane Interface
 * @member commands: Map<IBaseCommand['process']['action'], IBaseCommand>
 * @member worker: BaseWorker<any, any>
 * @method add: (command: IBaseCommand) => void
 * @method all: () => IBaseCommand[]
 * @method check: (command: IBaseCommand['process']['action']) => boolean
 * @method remove: (processId: IBaseCommand['processId']) => void
 * */
interface IBaseCommandPlane<T, U>
{
    commands?: Map<IBaseCommand['process']['action'], IBaseCommand>;
    worker?: IBaseWorker<T, U>;

    add(command: IBaseCommand): void;
    all(): IBaseCommand[];
    check(command: IBaseCommand['process']['action']): boolean;
    remove(processId: IBaseCommand['processId']): void;

}


/**
 * @class BaseCommandPlane
 * @description Base Node Command Plane
 * @implements IBaseCommandPlane
 * @member commands: Map<BaseCommand['process']['action'], BaseCommand>
 * @member worker: BaseWorker<any, any>
 * @method add: (command: BaseCommand) => void
 * @method all: () => BaseCommand[]
 * @method check: (command: BaseCommand['process']['action']) => boolean
 * @method remove: (processId: BaseCommand['processId']) => void
 * */
class BaseCommandPlane<T, U>
    implements IBaseCommandPlane<T, U>
{
    public commands: Map<BaseCommand['process']['action'], BaseCommand>;
    public worker?: BaseWorker<T, U>;

    public constructor({
        actions,
        worker
    } : {
        actions: BaseCommand[],
        worker?: BaseWorker<T, U>
    }) {
        if (!worker) {
            this.worker = new BaseWorker<T, U>();
        }

        this.commands = new Map<BaseCommand['process']['action'], BaseCommand>();

        for (let action of actions) {
            this.add(action);
        } 
    }

    public check(command: BaseCommand['process']['action']): boolean {
        const exists = this.commands.has(command);
        if (!exists) {
            logger({
                level: LogLevel.DEBUG,
                code: ResponseCode.NOT_FOUND,
                message: `BaseCommandPlane: ${command} command does not exist`
            })
        }
    }

    public add(command: BaseCommand): void {
        if (!this.check(command.process.action)) {
            this.commands.set(command.process.action, command);

            logger({
                level: LogLevel.DEBUG,
                code: ResponseCode.SUCCESS,
                message: `BaseCommandPlane: ${command.process.action} command added`
            })
        }
    }

    public remove(action: BaseCommand['process']['action']): void {
        if (this.check(action)) {
            this.commands.delete(action);

            logger({
                level: LogLevel.DEBUG,
                code: ResponseCode.SUCCESS,
                message: `BaseCommandPlane: ${action} command removed`
            })
        }
    }

    public all(): BaseCommand[] {
        return Array.from(this.commands.values());
    }
}


export {
    IBaseCommand,
    BaseCommand,
    IBaseCommandPlane,
    BaseCommandPlane,
    IBaseCommandProperties,
    BaseCommandProperties,
}