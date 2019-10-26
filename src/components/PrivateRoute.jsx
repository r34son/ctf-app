import React from 'react';
import { Route, Redirect } from 'react-router-dom'

export default ({ component: Component, ...rest }) => (
      <Route {...rest} render={props =>
        /*localStorage.getItem('authToken')*/1 ? (
            <Component {...props} />
        ) : (
            <Redirect to={{
                pathname: '/login',
                state: {from: props.location }
            }}/>
        )
    }/>
);