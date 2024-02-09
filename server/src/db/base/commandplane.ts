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
interface IBaseCommandPlane
{
    commands?: Map<IBaseCommand['process']['action'], IBaseCommand>;
    worker?: IBaseWorker<any, any>;

    add(command: IBaseCommand): void;
    all(): IBaseCommand[];
    check(command: IBaseCommand['process']['action']): boolean;
    remove(processId: IBaseCommand['processId']): void;

}

class BaseCommandPlane
    implements IBaseCommandPlane
{
    public commands: Map<BaseCommand['process']['action'], BaseCommand>;
    public worker?: BaseWorker<any, any>;

    public constructor({
        actions,
        worker
    } : {
        actions: BaseCommand[],
        worker?: BaseWorker<any, any>
    }) {
        if (!worker) {
            this.worker = new BaseWorker<any, any>();
        }

        this.commands = new Map<BaseCommand['process']['action'], BaseCommand>();

        for (let action of actions) {
            this.add(action);
        }
    }

    public check(command: BaseCommand['process']['action']): boolean {
        return this.commands.has(command);
    }

    public add(command: BaseCommand): void {
        if (this.check(command.process.action)) {


        this.commands.set(command.process.action, command);
        }
    }

    public remove(action: BaseCommand['process']['action']): void {
        this.commands.delete(action);
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