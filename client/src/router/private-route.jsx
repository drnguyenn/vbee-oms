import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Spinner from '../components/spinner/spinner.component';

import ROUTE_PATHS from './route-paths';

const PrivateRoute = ({ Component, ...rest }) => {
  const { currentUser, isLoading } = useSelector(state => state.user);

  return (
    <Route
      {...rest}
      render={props => {
        if (isLoading) return <Spinner />;

        return currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect to={ROUTE_PATHS.LOGIN} />
        );
      }}
    />
  );
};

export default PrivateRoute;
