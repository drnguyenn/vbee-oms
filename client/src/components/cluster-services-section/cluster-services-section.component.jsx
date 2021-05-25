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
import { AccountTree, Add } from '@material-ui/icons';

import { toggleServiceCreationModal } from '../../redux/modal/modal.actions';

import Section from '../section/section.component';
import ServiceCard from '../service-card/service-card.component';

import ROUTE_PATHS from '../../router/route-paths';

const useStyles = makeStyles({
  grid: {
    maxHeight: 350,
    maxWidth: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    margin: 'initial'
  },
  typography: {
    margin: 'auto'
  }
});

const HeaderOptions = () => {
  const { isProcessing } = useSelector(state => state.service);

  const { currentCluster } = useSelector(state => state.cluster);
  const { id } = currentCluster;

  const history = useHistory();

  const dispatch = useDispatch();

  const handleAddServiceClick = () => dispatch(toggleServiceCreationModal());

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

  return (
    <Section
      title='Services'
      subtitle={serviceCount ? <Subtitle serviceCount={serviceCount} /> : null}
      headerOptions={<HeaderOptions />}
    >
      <Grid className={classes.grid} container spacing={1}>
        {services.length ? (
          <Grid container justify='center' spacing={3}>
            {services.map(({ id, ...rest }) => (
              <Grid key={id || services.length} item>
                <ServiceCard id={id} {...rest} variant='small' />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography className={classes.typography}>
            No services found
          </Typography>
        )}
      </Grid>
    </Section>
  );
};

export default ClusterServicesSection;
