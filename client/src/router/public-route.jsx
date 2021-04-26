import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Spinner from '../components/spinner/spinner.component';

import ROUTE_PATHS from './route-paths';

const PublicRoute = ({ Component, restricted, ...rest }) => {
  const { currentUser, isLoading } = useSelector(state => state.user);

  return (
    <Route
      {...rest}
      render={props => {
        if (isLoading) return <Spinner />;

        return currentUser && restricted ? (
          <Redirect to={ROUTE_PATHS.HOME} />
        ) : (
          <Component {...props} />
        );
      }}
    />
  );
};

export default PublicRoute;
