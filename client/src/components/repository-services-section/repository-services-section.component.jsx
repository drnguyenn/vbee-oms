import { memo } from 'react';
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
import { Add, People } from '@material-ui/icons';

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
  },
  typography: {
    textAlign: 'center'
  }
});

const HeaderOptions = () => {
  const { isProcessing } = useSelector(state => state.service);

  const dispatch = useDispatch();

  const handleAddServiceClick = () =>
    dispatch(setServiceCreationModalOpen(true));

  return isProcessing ? (
    <CircularProgress size={20} />
  ) : (
    <Tooltip title='Add new service' arrow>
      <IconButton onClick={handleAddServiceClick} color='primary'>
        <Add />
      </IconButton>
    </Tooltip>
  );
};

const Subtitle = memo(({ serviceCount }) => (
  <span>
    <b>{serviceCount}</b>{' '}
    {serviceCount > 1 ? 'services are developed' : 'service is developed'} in
    this repository
  </span>
));

const RepositoryServicesSection = () => {
  const classes = useStyles();

  const { currentRepository } = useSelector(state => state.repository);
  const { services = [], serviceCount = 0 } = currentRepository;

  const { isProcessing } = useSelector(state => state.service);

  const history = useHistory();

  return (
    <Section
      title='Services'
      subtitle={serviceCount ? <Subtitle serviceCount={serviceCount} /> : null}
      headerOptions={<HeaderOptions />}
    >
      {serviceCount ? (
        <Grid className={classes.grid} container justify='center' spacing={3}>
          {services.map(({ id, name, version, memberCount, ...rest }) => (
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
                </Grid>
              </BaseCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography className={classes.typography}>
          No services found
        </Typography>
      )}
    </Section>
  );
};

export default RepositoryServicesSection;
