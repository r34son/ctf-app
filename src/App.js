import React from 'react';
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
import io from 'socket.io-client';
import config from './config';

const socket = io(`${config.protocol}://${config.server}:${config.port}`);

socket.on('connect', () => console.log('socket connected'));

export default () => {
  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <NavBar />
        <Route exact path='/' component={Login} />
        <Route path='/login' component={Login} />
        <PrivateRoute path='/tasks' component={Tasks} />
        <PrivateRoute path='/scoreboard' component={Scoreboard} />
        <Route path='/admin' component={Admin} />
        <Route path='/addteam' component={AddTeam} />
      </Router>
    </SocketContext.Provider>
  );
};
