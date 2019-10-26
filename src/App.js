import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import AdminRoute from './components/AdminRoute'
import PrivateRoute from './components/PrivateRoute'
import NavBar from './components/NavBar'
import Login from './components/Login'
import Scoreboard from './components/Scoreboard'
import Tasks from './components/Tasks'
import './App.css';

export default () => (
  <Router>
    <NavBar />
    <Route exact to="/" component={Scoreboard} />
    <Route to="/login" component={Login} />
    <PrivateRoute to="/tasks" component={Tasks} />
    <AdminRoute to="/scoreboard" component={Scoreboard} />
  </Router>
);

export default App;
