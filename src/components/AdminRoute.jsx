import { Route } from 'react-router-dom'

export default ({ isAdmin, component: Component, ...rest }) => (
      <Route {...rest} render={props =>
        isAdmin ? (
            <Component {...props} isAdmin />
        ) : (
            <Component {...props} />
        )
    }/>
);