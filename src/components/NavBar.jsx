import React, { useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import userContext from "../contexts/userContext";
import Timer from './Timer';

export default () => {
  const [current, setCurrent] = useState(1);
  const action = useRef();
  const [user] = useContext(userContext);

  return (
    <AppBar position='static'>
      <Tabs value={current} action={action} onChange={(_, value) => setCurrent(value)} centered>
        <Tab label='Tasks' component={Link} to='/tasks' />
        <Tab label='Scoreboard' component={Link} to='/scoreboard' />
        {!user.token && <Tab label='Login' component={Link} to='/login' />}
        {user.isAdmin && (
          <Tab label='Admin' component={Link} to='/admin' />
        )}
        {user.login && (
          <Tab
            label={`${user.login} ${user.isAdmin ? '(Админ)' : ''}`}
            disabled
          />
        )}
        {user.token && <Timer update={() => action.current.updateIndicator()} />}
      </Tabs>
    </AppBar>
  );
};
