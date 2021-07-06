import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  CircularProgress,
  Grid,
  Tooltip,
  Fab,
  makeStyles
} from '@material-ui/core';
import { People, Refresh, Web } from '@material-ui/icons';

import { fetchAllRepositoriesStart } from 'redux/repository/repository.actions';

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
    minHeight: 64
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

const handleLinkClick = event => event.stopPropagation();

const RepositoriesPage = () => {
  const classes = useStyles();

  const { repositories, isFetchingRepositories, isProcessing } = useSelector(
    state => state.repository
  );

  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!repositories.length) dispatch(fetchAllRepositoriesStart());
  }, [repositories.length, dispatch]);

  const handleRefreshButtonClick = () => dispatch(fetchAllRepositoriesStart());

  return (
    <BasePage
      title='Repositories'
      subtitle={`There are total of ${repositories.length} ${
        repositories.length > 1 ? 'repositories' : 'repository'
      } here`}
    >
      {isFetchingRepositories && <Spinner backdropClasses={classes.spinner} />}

      {!isFetchingRepositories && !repositories.length && <EmptyIndication />}

      <Grid container justify='center' spacing={3}>
        {repositories.map(
          (
            {
              id,
              name,
              owner,
              url,
              memberCount = 0,
              serviceCount = 0,
              ...rest
            },
            index
          ) => (
            <Grid key={id || index} item>
              <BaseCard
                title={name}
                subtitle={
                  <span>
                    of{' '}
                    <a
                      href={`https://github.com/${owner}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      onClick={handleLinkClick}
                    >
                      <b>{owner}</b>
                    </a>
                  </span>
                }
                description={
                  <a
                    href={url}
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={handleLinkClick}
                  >
                    {url}
                  </a>
                }
                isProcessing={isProcessing}
                handleClick={() =>
                  history.push(`${ROUTE_PATHS.REPOSITORIES}/${id}`)
                }
                {...rest}
              >
                <Grid container spacing={1}>
                  <Grid item xs={6} className={classes.gridItem}>
                    <People className={classes.icon} color='primary' />
                    {memberCount} member{memberCount > 1 && 's'}
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

      <Grid
        className={classes.fabGroup}
        container
        direction='column'
        spacing={1}
      >
        <Grid item className={classes.refreshButton}>
          {isFetchingRepositories ? (
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
      </Grid>
    </BasePage>
  );
};

export default RepositoriesPage;
