/* eslint-disable global-require */
import { lazy } from 'react';

import ROUTE_PATHS from './route-paths';

const LandingPage = lazy(() => import('../pages/landing/landing.component'));

const NotFoundPage = lazy(() =>
  import('../pages/not-found/not-found.component')
);

const HomePage = lazy(() => import('../pages/home/home.component'));

const ProfilePage = lazy(() => import('../pages/profile/profile.component'));

const DashboardPage = lazy(() =>
  import('../pages/dashboard/dashboard.component')
);

const ClustersPage = lazy(() => import('../pages/clusters/clusters.component'));
const ClusterDetailsPage = lazy(() =>
  import('../pages/cluster-details/cluster-details.component')
);
const ClusterArchitecturePage = lazy(() =>
  import('../pages/cluster-architecture/cluster-architecture.component')
);

const ServicesPage = lazy(() => import('../pages/services/services.component'));
const ServiceDetailsPage = lazy(() =>
  import('../pages/service-details/service-details.component')
);

const RepositoriesPage = lazy(() =>
  import('../pages/repositories/repositories.component')
);

const MembersPage = lazy(() => import('../pages/members/members.component'));

export default [
  {
    path: ROUTE_PATHS.LOGIN,
    component: LandingPage,
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
    path: ROUTE_PATHS.REPOSITORIES,
    component: RepositoriesPage,
    exact: true,
    restricted: false,
    isPrivate: true
  },
  {
    path: ROUTE_PATHS.MEMBERS,
    component: MembersPage,
    exact: true,
    restricted: false,
    isPrivate: true
  }
];
