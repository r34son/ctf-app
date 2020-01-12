import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Tabs, Tab } from '@material-ui/core';

import { getData } from '../utils';

export default () => {
  const [current, setCurrent] = useState(1);

  const [auth, setAuth] = useState(getData());

  window.addEventListener('storage', () => setAuth(getData()));

  return (
    <AppBar position='static'>
      <Tabs value={current} onChange={(_, value) => setCurrent(value)} centered>
        <Tab label='Tasks' component={Link} to='/tasks' />
        <Tab label='Scoreboard' component={Link} to='/scoreboard' />
        {!auth && <Tab label='Login' component={Link} to='/login' />}
        {auth && auth.isAdmin && (
          <Tab label='Admin' component={Link} to='/admin' />
        )}
        {auth && (
          <Tab
            label={`${auth.login} ${auth.isAdmin ? '(Админ)' : ''}`}
            disabled
          />
        )}
      </Tabs>
    </AppBar>
  );
};
