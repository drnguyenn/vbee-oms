import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import pluralize from 'pluralize';

import {
  CircularProgress,
  Grid,
  Tooltip,
  Fab,
  makeStyles
} from '@material-ui/core';
import { Add, People, Refresh, Storage, Web } from '@material-ui/icons';

import { fetchAllClustersStart } from 'redux/cluster/cluster.actions';
import { setClusterCreationModalOpen } from 'redux/modal/modal.actions';

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

const ClustersPage = () => {
  const classes = useStyles();

  const { clusters, isFetchingClusters, isProcessing } = useSelector(
    state => state.cluster
  );

  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!clusters.length) dispatch(fetchAllClustersStart());
  }, [clusters.length, dispatch]);

  const handleRefreshButtonClick = () => dispatch(fetchAllClustersStart());

  const handleAddButtonClick = () => {
    dispatch(setClusterCreationModalOpen(true));
  };

  return (
    <BasePage
      title='Clusters'
      subtitle={`There are total of ${pluralize(
        'cluster',
        clusters.length,
        true
      )} here`}
    >
      {isFetchingClusters && <Spinner backdropClasses={classes.spinner} />}

      {!isFetchingClusters && !clusters.length && <EmptyIndication />}

      <Grid container justify='center' spacing={3}>
        {clusters.map(
          (
            {
              id,
              name,
              memberCount = 0,
              serviceCount = 0,
              serverCount = 0,
              ...rest
            },
            index
          ) => (
            <Grid key={id || index} item>
              <BaseCard
                title={name}
                isProcessing={isProcessing}
                handleClick={() =>
                  history.push(`${ROUTE_PATHS.CLUSTERS}/${id}`)
                }
                {...rest}
              >
                <Grid container spacing={1}>
                  <Grid item xs={6} className={classes.gridItem}>
                    <People className={classes.icon} color='primary' />
                    {pluralize('member', memberCount, true)}
                  </Grid>
                  <Grid item xs={6} className={classes.gridItem}>
                    <Storage className={classes.icon} color='primary' />
                    {pluralize('server', serverCount, true)}
                  </Grid>
                  <Grid item xs={6} className={classes.gridItem}>
                    <Web className={classes.icon} color='primary' />
                    {pluralize('service', serviceCount, true)}
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
          {isFetchingClusters ? (
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

export default ClustersPage;
