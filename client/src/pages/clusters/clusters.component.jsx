import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Tooltip, Fab, makeStyles } from '@material-ui/core';
import { Add, People, Storage, Web } from '@material-ui/icons';

import { fetchAllClustersStart } from 'redux/cluster/cluster.actions';
import { setClusterCreationModalOpen } from 'redux/modal/modal.actions';

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
    dispatch(fetchAllClustersStart());
  }, [dispatch]);

  const handleAddButtonClick = () => {
    dispatch(setClusterCreationModalOpen(true));
  };

  return isFetchingClusters ? (
    <Spinner />
  ) : (
    <BasePage
      title='Clusters'
      subtitle={`There are total of ${clusters.length} cluster${
        clusters.length > 1 ? 's' : ''
      } here`}
    >
      {clusters.length ? (
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
                      {memberCount} member{memberCount > 1 && 's'}
                    </Grid>
                    <Grid item xs={6} className={classes.gridItem}>
                      <Storage className={classes.icon} color='primary' />
                      {serverCount} server{serverCount > 1 && 's'}
                    </Grid>
                    <Grid item xs={6} className={classes.gridItem}>
                      <Web className={classes.icon} color='primary' />
                      {serviceCount} service{serviceCount > 1 && 's'}
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

      <Tooltip title='Create new cluster' arrow>
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

export default ClustersPage;
