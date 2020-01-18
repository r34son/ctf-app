import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Scoreboard from './components/Scoreboard';
import Tasks from './components/Tasks';
import Admin from './components/Admin';
import AddTeam from './components/AddTeam';
import './App.css';

import SocketContext from './contexts/socketContext';
import UserContext from './contexts/userContext';
import { getData, setData } from './utils';
import io from 'socket.io-client';
import { protocol, server, port } from './config';

export default () => {
  const [user, setUser] = useState(getData() || {});
  const [socket, setSocket] = useState();

  useEffect(() => {
    if (user.token) {
      const socket = io(`${protocol}://${server}:${port}?token=${user.token}`);
      socket.on('connect', () => console.log('socket connected'));
      setSocket(socket);
      setData(user);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      <UserContext.Provider value={[user, setUser]}>
        <Router>
          <NavBar />
          <Route exact path='/' component={user.token ? Tasks : Login} />
          <Route path='/login' component={Login} />
          <PrivateRoute path='/tasks' component={Tasks} />
          <PrivateRoute path='/scoreboard' component={Scoreboard} />
          <PrivateRoute path='/admin' component={Admin} />
          <PrivateRoute path='/addteam' component={AddTeam} />
        </Router>
      </UserContext.Provider>
    </SocketContext.Provider>
  );
};
