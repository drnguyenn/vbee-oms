import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Tooltip, Fab, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { fetchAllServicesStart } from '../../redux/service/service.actions';
import { toggleServiceCreationModal } from '../../redux/modal/modal.actions';

import BasePage from '../base/base.component';

import Spinner from '../../components/spinner/spinner.component';
import ServiceCard from '../../components/service-card/service-card.component';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(8),
    right: theme.spacing(8),
    width: 70,
    height: 70
  }
}));

const ServicesPage = () => {
  const classes = useStyles();

  const { services, isFetchingServices } = useSelector(state => state.service);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllServicesStart());
  }, [dispatch]);

  const handleAddButtonClick = () => {
    dispatch(toggleServiceCreationModal());
  };

  return isFetchingServices ? (
    <Spinner />
  ) : (
    <BasePage
      title='Services'
      subtitle={`There are total of ${services.length} service${
        services.length > 1 ? 's' : ''
      } here`}
    >
      <Grid container spacing={1}>
        <Grid container justify='center' spacing={3}>
          {services.map(({ id, ...rest }) => (
            <Grid key={id || services.length} item>
              <ServiceCard id={id} {...rest} />
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Tooltip title='Create new service' arrow>
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

export default ServicesPage;
