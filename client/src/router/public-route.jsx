import { useEffect } from 'react';
import { Route, Redirect, useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Spinner from 'components/spinner/spinner.component';

import ROUTE_PATHS from './route-paths';

const PublicRoute = ({ Component, restricted, ...rest }) => {
  const { currentUser, isLoading } = useSelector(state => state.user);

  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: ROUTE_PATHS.HOME } };

  useEffect(() => {
    if (!isLoading && currentUser) history.replace(from);
  }, [currentUser, from, history, isLoading]);

  if (isLoading) return <Spinner />;

  return (
    <Route
      {...rest}
      render={props =>
        currentUser && restricted ? (
          <Redirect to={ROUTE_PATHS.HOME} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PublicRoute;
