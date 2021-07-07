/* eslint-disable global-require */
import { lazy } from 'react';

import ROUTE_PATHS from 'router/route-paths';

const LoginPage = lazy(() => import('pages/log-in/log-in.component'));

const NotFoundPage = lazy(() => import('pages/not-found/not-found.component'));

const HomePage = lazy(() => import('pages/home/home.component'));

const ProfilePage = lazy(() => import('pages/profile/profile.component'));

const DashboardPage = lazy(() => import('pages/dashboard/dashboard.component'));

const ClustersPage = lazy(() => import('pages/clusters/clusters.component'));
const ClusterDetailsPage = lazy(() =>
  import('pages/cluster-details/cluster-details.component')
);
const ClusterArchitecturePage = lazy(() =>
  import('pages/cluster-architecture/cluster-architecture.component')
);

const ServersPage = lazy(() => import('pages/servers/servers.component'));
const ServerDetailsPage = lazy(() =>
  import('pages/server-details/server-details.component')
);

const RepositoriesPage = lazy(() =>
  import('pages/repositories/repositories.component')
);
const RepositoryDetailsPage = lazy(() =>
  import('pages/repository-details/repository-details.component')
);

const ServicesPage = lazy(() => import('pages/services/services.component'));
const ServiceDetailsPage = lazy(() =>
  import('pages/service-details/service-details.component')
);

const UsersPage = lazy(() => import('pages/users/users.component'));

export default [
  {
    path: ROUTE_PATHS.LOGIN,
    component: LoginPage,
    exact: true,
    restricted: true,
    isPrivate: false
  },
  {
    path: ROUTE_PATHS.NOT_FOUND,
    component: NotFoundPage,
    exact: true,
    restricted: false,
    isPrivate: false
  },
  {
    path: ROUTE_PATHS.HOME,
    component: HomePage,
    exact: true,
    restricted: false,
    isPrivate: true
  },
  {
    path: ROUTE_PATHS.PROFILE,
    component: ProfilePage,
    exact: true,
    restricted: false,
    isPrivate: true
  },
  {
    path: ROUTE_PATHS.DASHBOARD,
    component: DashboardPage,
    exact: true,
    restricted: false,
    isPrivate: true
  },
  {
    path: ROUTE_PATHS.CLUSTERS,
    component: ClustersPage,
    exact: true,
    restricted: false,
    isPrivate: true
  },
  {
    path: ROUTE_PATHS.CLUSTER_DETAILS,
    component: ClusterDetailsPage,
    exact: true,
    restricted: false,
    isPrivate: true
  },
  {
    path: ROUTE_PATHS.CLUSTER_ARCHITECTURE,
    component: ClusterArchitecturePage,
    exact: true,
    restricted: false,
    isPrivate: true
  },
  {
    path: ROUTE_PATHS.SERVERS,
    component: ServersPage,
    exact: true,
    restricted: false,
    isPrivate: true
  },
  {
    path: ROUTE_PATHS.SERVER_DETAILS,
    component: ServerDetailsPage,
    exact: true,
    restricted: false,
    isPrivate: true
  },
  {
    path: ROUTE_PATHS.REPOSITORIES,
    component: RepositoriesPage,
    exact: true,
    restricted: false,
    isPrivate: true
  },
  {
    path: ROUTE_PATHS.REPOSITORY_DETAILS,
    component: RepositoryDetailsPage,
    exact: true,
    restricted: false,
    isPrivate: true
  },
  {
    path: ROUTE_PATHS.SERVICES,
    component: ServicesPage,
    exact: true,
    restricted: false,
    isPrivate: true
  },
  {
    path: ROUTE_PATHS.SERVICE_DETAILS,
    component: ServiceDetailsPage,
    exact: true,
    restricted: false,
    isPrivate: true
  },

  {
    path: ROUTE_PATHS.USERS,
    component: UsersPage,
    exact: true,
    restricted: false,
    isPrivate: true
  }
];
