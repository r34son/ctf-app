import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import NavBar from './components/NavBar'
import Login from './components/Login'
import Scoreboard from './components/Scoreboard'
import Tasks from './components/Tasks'
import Admin from './components/Admin'
import AddTeam from './components/AddTeam'
import './App.css';

export default () => (
  <Router>
    <NavBar />
    <Route exact path="/" component={Scoreboard} />
    <Route path="/login" component={Login} />
    <PrivateRoute path="/tasks" component={Tasks} />
    <Route path="/scoreboard" component={Scoreboard} />
    <Route path="/admin" component={Admin} />
    <Route path="/addteam" component={AddTeam} />
  </Router>
)

