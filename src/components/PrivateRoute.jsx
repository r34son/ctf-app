import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getData } from '../utils';

export default ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      getData() ? (
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
);
