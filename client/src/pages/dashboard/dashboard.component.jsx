import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import pluralize from 'pluralize';

import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Grow,
  Tooltip,
  Fab,
  makeStyles,
  Typography
} from '@material-ui/core';
import {
  Kitchen,
  People,
  Refresh,
  Storage,
  ViewCarousel,
  Web
} from '@material-ui/icons';

import { fetchOverallStatisticsStart } from 'redux/dashboard/dashboard.actions';

import BasePage from 'pages/base/base.component';

import Spinner from 'components/spinner/spinner.component';

import ROUTE_PATHS from 'router/route-paths';

const useStyles = makeStyles(theme => ({
  card: {
    width: 350,
    height: 215,
    cursor: 'pointer',

    [theme.breakpoints.down('xs')]: {
      width: 250
    }
  },
  cardContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: '5rem'
  },
  subtitle: {
    display: 'flex',
    alignItems: 'center',
    textTransform: 'capitalize'
  },
  fabGroup: {
    position: 'fixed',
    width: 'fit-content',
    bottom: theme.spacing(4),
    right: theme.spacing(4)
  },
  refreshButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 64,
    minWidth: 64
  },
  cardIcon: {
    marginRight: 8,
    fontSize: 'larger'
  },
  spinner: {
    zIndex: 1100
  }
}));

const DashboardPage = () => {
  const classes = useStyles();

  const { statistics, isFetchingOverallStatistics } = useSelector(
    state => state.dashboard
  );

  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!statistics) dispatch(fetchOverallStatisticsStart());
  }, [statistics, dispatch]);

  const cards = useMemo(
    () => [
      {
        id: 'cluster',
        icon: <ViewCarousel className={classes.cardIcon} color='primary' />,
        route: ROUTE_PATHS.CLUSTERS
      },
      {
        id: 'server',
        icon: <Storage className={classes.cardIcon} color='primary' />,
        route: ROUTE_PATHS.SERVERS
      },
      {
        id: 'service',
        icon: <Web className={classes.cardIcon} color='primary' />,
        route: ROUTE_PATHS.SERVICES
      },
      {
        id: 'repository',
        icon: <Kitchen className={classes.cardIcon} color='primary' />,
        route: ROUTE_PATHS.REPOSITORIES
      },
      {
        id: 'user',
        icon: <People className={classes.cardIcon} color='primary' />,
        route: ROUTE_PATHS.USERS
      }
    ],
    [classes.cardIcon]
  );

  const handleRefreshButtonClick = () =>
    dispatch(fetchOverallStatisticsStart());

  return (
    <BasePage title='Dashboard' subtitle='System overview'>
      {isFetchingOverallStatistics && (
        <Spinner backdropClasses={classes.spinner} />
      )}

      <Grid container justify='center' spacing={3}>
        {cards.map(({ id, icon, route }) => {
          const count = statistics ? statistics[id].count : 0;

          return (
            <Grid key={id} item>
              <Grow in>
                <Card
                  className={classes.card}
                  onClick={() => history.push(route)}
                  raised
                >
                  <CardContent className={classes.cardContent}>
                    <Typography
                      className={classes.title}
                      component='span'
                      color='primary'
                    >
                      {count}
                    </Typography>
                    <Typography
                      className={classes.subtitle}
                      variant='h5'
                      component='span'
                    >
                      {icon}
                      {pluralize(id, count)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          );
        })}
      </Grid>

      <Grid
        className={classes.fabGroup}
        container
        direction='column'
        spacing={1}
      >
        <Grid item className={classes.refreshButton}>
          {isFetchingOverallStatistics ? (
            <Tooltip title='Fetching...' placement='left' arrow>
              <CircularProgress size={20} />
            </Tooltip>
          ) : (
            <Tooltip title='Refresh' placement='left' arrow>
              <Fab onClick={handleRefreshButtonClick}>
                <Refresh />
              </Fab>
            </Tooltip>
          )}
        </Grid>
      </Grid>
    </BasePage>
  );
};

export default DashboardPage;
