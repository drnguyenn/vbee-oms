import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Tooltip, Fab, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { fetchAllClustersStart } from '../../redux/cluster/cluster.actions';
import { toggleClusterCreationModal } from '../../redux/modal/modal.actions';

import BasePage from '../base/base.component';

import Spinner from '../../components/spinner/spinner.component';
import ClusterCard from '../../components/cluster-card/cluster-card.component';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(8),
    right: theme.spacing(8),
    width: 70,
    height: 70
  }
}));

const ClustersPage = () => {
  const classes = useStyles();

  const { clusters, isFetchingClusters } = useSelector(state => state.cluster);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllClustersStart());
  }, [dispatch]);

  const handleAddButtonClick = () => {
    dispatch(toggleClusterCreationModal());
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
      <Grid container spacing={1}>
        <Grid container justify='center' spacing={3}>
          {clusters.map(({ id, ...rest }) => (
            <Grid key={id || clusters.length} item>
              <ClusterCard id={id} {...rest} />
            </Grid>
          ))}
        </Grid>
      </Grid>

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
