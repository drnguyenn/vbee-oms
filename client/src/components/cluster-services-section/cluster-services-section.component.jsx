import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  CircularProgress,
  Grid,
  Typography,
  Tooltip,
  IconButton,
  makeStyles
} from '@material-ui/core';
import { AccountTree, Add, Kitchen, People } from '@material-ui/icons';

import { setServiceCreationModalOpen } from 'redux/modal/modal.actions';

import Section from 'components/section/section.component';
import BaseCard from 'components/base-card/base-card.component';

import ROUTE_PATHS from 'router/route-paths';

const useStyles = makeStyles({
  grid: {
    maxHeight: 350,
    maxWidth: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    margin: 'initial'
  },
  version: {
    marginBottom: '0.8rem'
  },
  gridItem: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: '0.625rem'
  }
});

const HeaderOptions = () => {
  const { isProcessing } = useSelector(state => state.service);

  const { currentCluster } = useSelector(state => state.cluster);
  const { id } = currentCluster;

  const history = useHistory();

  const dispatch = useDispatch();

  const handleAddServiceClick = () =>
    dispatch(setServiceCreationModalOpen(true));

  const handleDiagramClick = () =>
    history.push(`${ROUTE_PATHS.CLUSTERS}/${id}/architecture`);

  return (
    <div>
      <Tooltip title='Show architecture in diagram' arrow>
        <IconButton onClick={handleDiagramClick}>
          <AccountTree />
        </IconButton>
      </Tooltip>
      {isProcessing ? (
        <CircularProgress size={25} />
      ) : (
        <Tooltip title='Add new service' arrow>
          <IconButton onClick={handleAddServiceClick} color='primary'>
            <Add />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

const Subtitle = ({ serviceCount }) => (
  <span>
    <b>
      {serviceCount}/{serviceCount}
    </b>
    {serviceCount > 1 ? ' are ' : ' is '}healthy
  </span>
);

const ClusterServicesSection = () => {
  const classes = useStyles();

  const { currentCluster } = useSelector(state => state.cluster);
  const { services = [], serviceCount = 0 } = currentCluster;

  const { isProcessing } = useSelector(state => state.service);

  const history = useHistory();

  return (
    <Section
      title='Services'
      subtitle={serviceCount ? <Subtitle serviceCount={serviceCount} /> : null}
      headerOptions={<HeaderOptions />}
    >
      <Grid container justify='center' spacing={3}>
        {services.map(
          ({ id, name, version, memberCount, repositoryCount, ...rest }) => (
            <Grid key={id} item>
              <BaseCard
                title={name}
                isProcessing={isProcessing}
                handleClick={() =>
                  history.push(`${ROUTE_PATHS.SERVICES}/${id}`)
                }
                {...rest}
              >
                <Typography className={classes.version} color='primary'>
                  {version && `v${version}`}
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6} className={classes.gridItem}>
                    <People className={classes.icon} color='primary' />
                    {memberCount} member{memberCount > 1 && 's'}
                  </Grid>
                  <Grid item xs={6} className={classes.gridItem}>
                    <Kitchen className={classes.icon} color='primary' />
                    {repositoryCount} repositor
                    {repositoryCount > 1 ? 'ies' : 'y'}
                  </Grid>
                </Grid>
              </BaseCard>
            </Grid>
          )
        )}
      </Grid>
    </Section>
  );
};

export default ClusterServicesSection;
