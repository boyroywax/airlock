import { Libp2pNode } from '../server/src/db/libp2p/index';

const node = new Libp2pNode();

node.start().then(() => {
  console.log('Node started');
});
