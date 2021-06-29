import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Tooltip, Fab, makeStyles } from '@material-ui/core';
import { Add, List, Web } from '@material-ui/icons';

import { fetchAllServersStart } from 'redux/server/server.actions';
import { setServerCreationModalOpen } from 'redux/modal/modal.actions';

import BasePage from 'pages/base/base.component';

import Spinner from 'components/spinner/spinner.component';
import BaseCard from 'components/base-card/base-card.component';
import EmptyIndication from 'components/empty-indication/empty-indication.component';

import ROUTE_PATHS from 'router/route-paths';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(8),
    right: theme.spacing(8),
    width: 70,
    height: 70
  },
  gridItem: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: '0.625rem'
  },
  typography: {
    textAlign: 'center'
  }
}));

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

  const handleAddButtonClick = () => {
    dispatch(setServerCreationModalOpen(true));
  };

  return isFetchingServers ? (
    <Spinner />
  ) : (
    <BasePage
      title='Servers'
      subtitle={`There are total of ${servers.length} server${
        servers.length > 1 ? 's' : ''
      } here`}
    >
      {servers.length ? (
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
                        of <b>{cluster.name}</b>
                      </span>
                    )
                  }
                  description={`${ipAddress.toUpperCase()}\n${macAddress.toUpperCase()}`}
                  isProcessing={isProcessing}
                  handleClick={() =>
                    history.push(`${ROUTE_PATHS.SERVERS}/${id}`)
                  }
                  {...rest}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={6} className={classes.gridItem}>
                      <Web className={classes.icon} color='primary' />
                      {serviceCount} service{serviceCount > 1 && 's'}
                    </Grid>
                    <Grid item xs={6} className={classes.gridItem}>
                      <List className={classes.icon} color='primary' />
                      {domainCount} domain{domainCount > 1 && 's'}
                    </Grid>
                  </Grid>
                </BaseCard>
              </Grid>
            )
          )}
        </Grid>
      ) : (
        <EmptyIndication />
      )}

      <Tooltip title='Create new server' arrow>
        <Fab
          className={classes.fab}
          color='primary'
          onClick={handleAddButtonClick}
        >
          <Add />
        </Fab>
      </Tooltip>
    </BasePage>
  );
};

export default ServersPage;
