import { Libp2p } from 'libp2p';
import { Multiaddr, multiaddr} from '@multiformats/multiaddr';
import { Libp2pStatus, ServiceMap, Connection, Stream } from '@libp2p/interface';

import { Libp2pNode } from './node.js';
import { INodeCommandPlane, INodeCommand, INodeCommandResponse } from '../../models/index.js';
import { LogBookNames } from '../../models/logs.js';
import { getLogBook, LogBook } from '../../utils/logBook.js';


const logger: LogBook  = getLogBook(LogBookNames.LIBP2P)


enum Libp2pCommands {
    DIAL = 'dial',
    DIALPROTOCOL = 'dialProtocol',
    HANGUP = 'hangUp',
    CLOSE_CONNECTION = 'closeConnection',
    LIST_CONNECTIONS = 'listConnections',
}

class Libp2pNodeCommand implements INodeCommand {
    public command: Libp2pCommands | string;
    public args: string[];

    public constructor(
        command: Libp2pCommands | string,
        args: string[] = []
    ) {
        this.command = command;
        this.args = args;
    }
}


class Libp2pNodeCommandPlane implements INodeCommandPlane {
    public nodeWorker: Libp2pNode;
    private tempConnection?: Connection;
    private tempStream?: Stream;

    public constructor(
        node: Libp2pNode,
    ) {
        this.nodeWorker = node;
    }

    public async execute(command: Libp2pNodeCommand | INodeCommand ): Promise<INodeCommandResponse> {
        let response: INodeCommandResponse = {
            code: 200,
            message: "Command Executed"
        }

        switch (command.command as Libp2pCommands) {
            case Libp2pCommands.DIAL:
                this.tempConnection = await this.dialConnection(command.args[0])
            case Libp2pCommands.DIALPROTOCOL:
                if (this.tempConnection) {
                    this.tempStream = await this.newStream(command.args[0], this.tempConnection)
                }
                else {
                    response = {
                        code: 404,
                        message: "Connection Not Found, Please Dial Connection First"
                    }
                }
            case Libp2pCommands.CLOSE_CONNECTION:
                if (this.tempConnection) {
                    await this.closeConnection(this.tempConnection)
                }
                else {
                    response = {
                        code: 404,
                        message: "Connection Not Found"
                    }
                }
            case Libp2pCommands.HANGUP:
                try {
                    const output = await this.hangUp(command.args[0])
                    response = {
                        code: 200,
                        message: "Connection Hung Up",
                        output: output
                    }
                }
                catch (error: any) {
                    response = {
                        code: 404,
                        message: "Connection Not Found",
                        error: error
                    }
                }
            case Libp2pCommands.LIST_CONNECTIONS:
                try {
                    const output = this.listConnections()
                    response = {
                        code: 200,
                        message: "Command Executed",
                        output: output
                    }
                }
                catch (error: any) {
                    response = {
                        code: 404,
                        message: "Command Failed",
                        error: error
                    }
                }
        }
        return response
    }

    /**
     * @function dialConnection
     * @param address  The address to dial
     * @returns Connection - The connection
     */
    public async dialConnection(address: string): Promise<Connection> {
        const dialAddress: Multiaddr = multiaddr(address)
        const connection: Connection = await this.nodeWorker.instance.dial(dialAddress)
        return connection
    }

    /**
     * @function newStream
     * @param connection  The connection to create the stream from
     * @returns Stream - The new stream
     */
    public async newStream(protocol: string, connection: Connection): Promise<Stream> {
        try {
            return await connection.newStream(protocol)
        }
        catch (error: any) {
            return error
        }
    }

    /**
     * @function listConnections
     * @returns string[] - The list of connections
     * @description Lists the connections
     */
    public listConnections(): string[] {
        const connections: Connection[] = this.nodeWorker.instance.getConnections()
        return connections.map((connection: Connection) => {
            return connection.remoteAddr.toString()
        })
    }

    /**
     * @function closeConnection
     * @param connection  The connection to close
     * @returns void
     * @description Closes the connection
     */
    public async closeConnection(connection: Connection) {
        return await connection.close()
    }

    /**
     * @function hangUp
     * @param address  The address to hang up
     * @returns void
     * @description Hangs up the connection
     */
    public async hangUp(address: string) {
        const hangUpAddress: Multiaddr = multiaddr(address)
        return await this.nodeWorker.instance.hangUp(hangUpAddress)
    }
}

export {
    Libp2pCommands,
    Libp2pNodeCommand,
    Libp2pNodeCommandPlane
}