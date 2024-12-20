import { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import pluralize from 'pluralize';

import {
  CircularProgress,
  Grid,
  Tooltip,
  Fab,
  makeStyles
} from '@material-ui/core';
import { Add, List, Refresh, Web } from '@material-ui/icons';

import { fetchAllServersStart } from 'redux/server/server.actions';
import { setServerCreationModalOpen } from 'redux/modal/modal.actions';

import BasePage from 'pages/base/base.component';

import Spinner from 'components/spinner/spinner.component';
import BaseCard from 'components/base-card/base-card.component';
import EmptyIndication from 'components/empty-indication/empty-indication.component';

import ROUTE_PATHS from 'router/route-paths';

const useStyles = makeStyles(theme => ({
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
  gridItem: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: '0.625rem'
  },
  spinner: {
    zIndex: 1100
  }
}));

const handleLinkClick = event => event.stopPropagation();

const ServersPage = () => {
  const classes = useStyles();

  const { servers, isFetchingServers, isProcessing } = useSelector(
    state => state.server
  );

  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!servers.length) dispatch(fetchAllServersStart());
  }, [servers.length, dispatch]);

  const handleRefreshButtonClick = () => dispatch(fetchAllServersStart());

  const handleAddButtonClick = () => {
    dispatch(setServerCreationModalOpen(true));
  };

  return (
    <BasePage
      title='Servers'
      subtitle={`There are total of ${pluralize(
        'server',
        servers.length,
        true
      )} here`}
    >
      {isFetchingServers && <Spinner backdropClasses={classes.spinner} />}

      {!isFetchingServers && !servers.length && <EmptyIndication />}

      <Grid container justify='center' spacing={3}>
        {servers.map(
          (
            {
              id,
              name,
              cluster,
              ipAddress,
              macAddress,
              serviceCount = 0,
              domainCount = 0,
              ...rest
            },
            index
          ) => (
            <Grid key={id || index} item>
              <BaseCard
                title={name}
                subtitle={
                  cluster &&
                  cluster.name && (
                    <span>
                      of{' '}
                      <Link
                        to={`${ROUTE_PATHS.CLUSTERS}/${cluster.id}`}
                        onClick={handleLinkClick}
                      >
                        <b>{cluster.name}</b>
                      </Link>
                    </span>
                  )
                }
                description={`${ipAddress.toUpperCase()}\n${macAddress.toUpperCase()}`}
                isProcessing={isProcessing}
                handleClick={() => history.push(`${ROUTE_PATHS.SERVERS}/${id}`)}
                {...rest}
              >
                <Grid container spacing={1}>
                  <Grid item xs={6} className={classes.gridItem}>
                    <Web className={classes.icon} color='primary' />
                    {pluralize('service', serviceCount, true)}
                  </Grid>
                  <Grid item xs={6} className={classes.gridItem}>
                    <List className={classes.icon} color='primary' />
                    {pluralize('domain', domainCount, true)}
                  </Grid>
                </Grid>
              </BaseCard>
            </Grid>
          )
        )}
      </Grid>

      <Grid
        className={classes.fabGroup}
        container
        direction='column'
        spacing={1}
      >
        <Grid item className={classes.refreshButton}>
          {isFetchingServers ? (
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
        <Grid item>
          <Tooltip title='Create new cluster' placement='left' arrow>
            <Fab color='primary' onClick={handleAddButtonClick}>
              <Add />
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
    </BasePage>
  );
};

export default ServersPage;
