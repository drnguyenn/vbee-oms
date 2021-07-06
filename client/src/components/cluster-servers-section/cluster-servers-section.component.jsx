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
import { AccountTree, Add, List, Web } from '@material-ui/icons';

import { setServerCreationModalOpen } from 'redux/modal/modal.actions';

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
  const { isProcessing } = useSelector(state => state.server);

  const { currentCluster } = useSelector(state => state.cluster);
  const { id } = currentCluster;

  const history = useHistory();

  const dispatch = useDispatch();

  const handleAddServerClick = () => dispatch(setServerCreationModalOpen(true));

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
        <CircularProgress size={20} />
      ) : (
        <Tooltip title='Add new server' arrow>
          <IconButton onClick={handleAddServerClick} color='primary'>
            <Add />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

const Subtitle = memo(({ serverCount }) => (
  <span>
    <b>{serverCount}</b> {serverCount > 1 ? 'servers belong' : 'server belongs'}{' '}
    to this cluster
  </span>
));

const ClusterServersSection = () => {
  const classes = useStyles();

  const { currentCluster } = useSelector(state => state.cluster);
  const { servers = [], serverCount = 0 } = currentCluster;

  const { isProcessing } = useSelector(state => state.server);

  const history = useHistory();

  return (
    <Section
      title='Servers'
      subtitle={serverCount ? <Subtitle serverCount={serverCount} /> : null}
      headerOptions={<HeaderOptions />}
    >
      {serverCount ? (
        <Grid className={classes.grid} container justify='center' spacing={3}>
          {servers.map(
            (
              {
                id,
                name,
                ipAddress,
                macAddress,
                serviceCount = 0,
                domainCount = 0,
                ...rest
              },
              index
            ) => (
              <Grid key={id || index} item>
                <BaseCard
                  title={name}
                  description={`${ipAddress.toUpperCase()}\n${macAddress.toUpperCase()}`}
                  isProcessing={isProcessing}
                  handleClick={() =>
                    history.push(`${ROUTE_PATHS.SERVERS}/${id}`)
                  }
                  {...rest}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={6} className={classes.gridItem}>
                      <Web className={classes.icon} color='primary' />
                      {serviceCount} service{serviceCount > 1 && 's'}
                    </Grid>
                    <Grid item xs={6} className={classes.gridItem}>
                      <List className={classes.icon} color='primary' />
                      {domainCount} domain{domainCount > 1 && 's'}
                    </Grid>
                  </Grid>
                </BaseCard>
              </Grid>
            )
          )}
        </Grid>
      ) : (
        <Typography className={classes.typography}>No servers found</Typography>
      )}
    </Section>
  );
};

export default ClusterServersSection;
