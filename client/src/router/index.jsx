import { Suspense } from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { Backdrop } from '@material-ui/core';

import PublicRoute from './public-route';
import PrivateRoute from './private-route';

import ROUTE_PATHS from './route-paths';

import appRoutes from './app.routes';

import ErrorBoundary from '../pages/error-boundary/error-boundary.component';

export default () => (
  <ErrorBoundary>
    <Suspense fallback={<Backdrop open />}>
      <Switch>
        {appRoutes.map(({ isPrivate, path, component, ...rest }) =>
          isPrivate ? (
            <PrivateRoute
              key={path}
              path={path}
              Component={component}
              {...rest}
            />
          ) : (
            <PublicRoute
              key={path}
              path={path}
              Component={component}
              {...rest}
            />
          )
        )}
        <Redirect to={ROUTE_PATHS.NOT_FOUND} />
      </Switch>
    </Suspense>
  </ErrorBoundary>
);
