import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Tooltip, Fab, Typography, makeStyles } from '@material-ui/core';
import { Add, People, Kitchen } from '@material-ui/icons';

import { fetchAllServicesStart } from 'redux/service/service.actions';
import { setServiceCreationModalOpen } from 'redux/modal/modal.actions';

import BasePage from 'pages/base/base.component';

import Spinner from 'components/spinner/spinner.component';
import BaseCard from 'components/base-card/base-card.component';

import ROUTE_PATHS from 'router/route-paths';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(8),
    right: theme.spacing(8),
    width: 70,
    height: 70
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
}));

const ServicesPage = () => {
  const classes = useStyles();

  const { services, isFetchingServices, isProcessing } = useSelector(
    state => state.service
  );

  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllServicesStart());
  }, [dispatch]);

  const handleAddButtonClick = () => {
    dispatch(setServiceCreationModalOpen(true));
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
          {services.map(
            ({
              id,
              name,
              cluster,
              version,
              memberCount,
              repositoryCount,
              ...rest
            }) => (
              <Grid key={id} item>
                <BaseCard
                  title={name}
                  subtitle={
                    cluster.name && (
                      <span>
                        of <b>{cluster.name}</b>
                      </span>
                    )
                  }
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
