
import { Libp2p, Libp2pOptions } from 'libp2p';

import { BaseNodeId } from '../src/db/base/node.js';
import { Libp2pNodesManager } from '../src/db/libp2p.js';
import { BaseNodeCreateOptions } from '../src/db/base/manager.js';
import { BaseNodeCommand, BaseNodeCommandOptions } from '../src/db/base/commands.js';
import { expect } from 'chai';

describe('Libp2pNode', () => {
  let libp2pManager: Libp2pNodesManager<Libp2p, Libp2pOptions>;
  let baseNodeId: BaseNodeId = new BaseNodeId('libp2pNode123');
  let listNodeCommandOptions: BaseNodeCommandOptions = {
    action: 'listConnections',
    args: [],
    kwargs: {}
  };
  let listConnectionsCommand: BaseNodeCommand = new BaseNodeCommand(listNodeCommandOptions);

  beforeEach(() => {
    // Create a new instance of Libp2pManager before each test
    libp2pManager = new Libp2pNodesManager();
    // Create a new instance of Libp2pNode using the Libp2pManager
    libp2pManager.create({
      id: baseNodeId
    } as BaseNodeCreateOptions<Libp2p, Libp2pOptions>);
  });

  it('should connect to peers', () => {
    // Test the connectToPeers method of Libp2pNode
    // Mock the necessary dependencies and assert the expected behavior
    // For example:
    // libp2pManager.get(new BaseNodeId('libp2pNode123')).commands.execute(listConnectionsCommand);
    libp2pManager.get(new BaseNodeId('libp2pNode123')).commands.execute(listConnectionsCommand);
    expect(libp2pManager.get(new BaseNodeId('libp2pNode123')).commands.commands.get('listConnections')?.output).not.to.be.null;
  });

  // Add more test cases to cover other methods and functionalities of Libp2pNode
});


