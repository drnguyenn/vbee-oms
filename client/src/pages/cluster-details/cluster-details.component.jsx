import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Button, makeStyles } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

import {
  fetchClusterStart,
  setCurrentCluster
} from 'redux/cluster/cluster.actions';
import { setClusterDeleteConfirmationModalOpen } from 'redux/modal/modal.actions';

import ROUTE_PATHS from 'router/route-paths';

import BasePage from 'pages/base/base.component';

import Spinner from 'components/spinner/spinner.component';
import Section from 'components/section/section.component';
import ClusterBasicInfoSection from 'components/cluster-basic-info-section/cluster-basic-info-section.component';
import ClusterMembersSection from 'components/cluster-members-section/cluster-members-section.component';
import ClusterServicesSection from 'components/cluster-services-section/cluster-services-section.component';

const useStyles = makeStyles({
  textField: {
    width: '70%'
  },
  button: {
    display: 'flex',
    margin: '0 auto'
  }
});

const ClusterDetailsPage = () => {
  const classes = useStyles();

  const { id } = useParams();

  const { currentCluster, isFetchingCurrentCluster, error } = useSelector(
    state => state.cluster
  );

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    dispatch(fetchClusterStart(id));

    return () => dispatch(setCurrentCluster(null));
  }, [dispatch, id]);

  useEffect(() => {
    if (error)
      if (error.message === 'Cluster not found')
        history.push(ROUTE_PATHS.NOT_FOUND);
  }, [error, history]);

  const handleDeleteButtonClick = () =>
    dispatch(setClusterDeleteConfirmationModalOpen(true));

  const handleHeaderButtonClick = () => history.push(ROUTE_PATHS.CLUSTERS);

  if (isFetchingCurrentCluster) return <Spinner />;

  if (currentCluster)
    return (
      <BasePage
        title={currentCluster.name}
        subtitle='Manage cluster’s basic info, architecture, services and more'
        showHeaderButton
        tooltipTitle='Back to Cluster Page'
        headerButtonOnClick={handleHeaderButtonClick}
      >
        <ClusterBasicInfoSection />

        <ClusterServicesSection />

        <ClusterMembersSection />

        <Section title='Danger zone'>
          <Button
            variant='outlined'
            color='secondary'
            className={classes.button}
            startIcon={<Delete />}
            onClick={handleDeleteButtonClick}
          >
            Delete this cluster
          </Button>
        </Section>
      </BasePage>
    );

  return null;
};

export default ClusterDetailsPage;
