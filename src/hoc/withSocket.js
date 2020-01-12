import React from 'react';
import SocketContext from '../contexts/socketContext';

const withSocket = Component => () => (
  <SocketContext.Consumer>
    {value => <Component socket={value} />}
  </SocketContext.Consumer>
);

export default withSocket;
