import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import userContext from '../contexts/userContext';

export default ({ component: Component, ...rest }) => {
  const [user] = useContext(userContext);

  return (
    <Route
      {...rest}
      render={props =>
        user.token ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  )
};
