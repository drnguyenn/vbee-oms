import { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import pluralize from 'pluralize';

import {
  Chip,
  CircularProgress,
  Grid,
  Tooltip,
  Fab,
  makeStyles
} from '@material-ui/core';
import { Add, People, Refresh } from '@material-ui/icons';

import { fetchAllServicesStart } from 'redux/service/service.actions';
import { setServiceCreationModalOpen } from 'redux/modal/modal.actions';

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
  cardTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  icon: {
    marginRight: '0.625rem'
  },
  spinner: {
    zIndex: 1100
  }
}));

const handleCardItemClick = event => event.stopPropagation();

const ServicesPage = () => {
  const classes = useStyles();

  const { services, isFetchingServices, isProcessing } = useSelector(
    state => state.service
  );

  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!services.length) dispatch(fetchAllServicesStart());
  }, [services.length, dispatch]);

  const handleRefreshButtonClick = () => dispatch(fetchAllServicesStart());

  const handleAddButtonClick = () => {
    dispatch(setServiceCreationModalOpen(true));
  };

  return (
    <BasePage
      title='Services'
      subtitle={`There are total of ${pluralize(
        'service',
        services.length,
        true
      )} here`}
    >
      {isFetchingServices && <Spinner backdropClasses={classes.spinner} />}

      {!isFetchingServices && !services.length && <EmptyIndication />}

      <Grid container justify='center' spacing={3}>
        {services.map(
          ({ id, name, cluster, version, memberCount = 0, ...rest }, index) => (
            <Grid key={id || index} item>
              <BaseCard
                title={
                  <div className={classes.cardTitle}>
                    <span>{name}</span>
                    {version && (
                      <Chip
                        label={`v${version}`}
                        color='primary'
                        onClick={handleCardItemClick}
                      />
                    )}
                  </div>
                }
                subtitle={
                  cluster &&
                  cluster.name && (
                    <span>
                      of{' '}
                      <Link
                        to={`${ROUTE_PATHS.CLUSTERS}/${cluster.id}`}
                        onClick={handleCardItemClick}
                      >
                        <b>{cluster.name}</b>
                      </Link>
                    </span>
                  )
                }
                isProcessing={isProcessing}
                handleClick={() =>
                  history.push(`${ROUTE_PATHS.SERVICES}/${id}`)
                }
                {...rest}
              >
                <Grid container spacing={1}>
                  <Grid item xs={6} className={classes.gridItem}>
                    <People className={classes.icon} color='primary' />
                    {pluralize('member', memberCount, true)}
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
          {isFetchingServices ? (
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
          <Tooltip title='Create new service' placement='left' arrow>
            <Fab color='primary' onClick={handleAddButtonClick}>
              <Add />
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
    </BasePage>
  );
};

export default ServicesPage;
