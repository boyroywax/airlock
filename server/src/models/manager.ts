import { INode, INodeConfig, INodeActionResponse } from './node.js';
import { IOpenDBOptions } from './orbitdb.js';


interface INodesManagerConfig {
    instances?: INode[];
    options?: INodeConfig[];
}

interface INodesManager {
    instances: Map<string, INode>;

    create(config?: INodeConfig | IOpenDBOptions): INodeActionResponse;  // creates a new instance and adds it to the instances map
    add(instance: INode): INodeActionResponse;  // adds an existing instance to the instances map
    get(id: INode['id']): INode | INodeActionResponse;  // returns an instance by id
    list(): string[];  // returns an array of all instances
    delete(id: INode['id']): INodeActionResponse;  // deletes an instance by id
}

export {
    INodesManager,
    INodesManagerConfig
}
