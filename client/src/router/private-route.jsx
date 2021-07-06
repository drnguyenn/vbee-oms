import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Spinner from 'components/spinner/spinner.component';

import ROUTE_PATHS from './route-paths';

const PrivateRoute = ({ Component, ...rest }) => {
  const { currentUser, isLoading } = useSelector(state => state.auth);

  if (isLoading) return <Spinner />;

  return (
    <Route
      {...rest}
      render={props =>
        currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: ROUTE_PATHS.LOGIN,
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
