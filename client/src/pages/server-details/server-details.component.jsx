import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Button, makeStyles } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

import {
  fetchServerStart,
  setCurrentServer
} from 'redux/server/server.actions';
import { setServerDeleteConfirmationModalOpen } from 'redux/modal/modal.actions';

import ROUTE_PATHS from 'router/route-paths';

import BasePage from 'pages/base/base.component';

import Spinner from 'components/spinner/spinner.component';
import Section from 'components/section/section.component';
import ServerBasicInfoSection from 'components/server-basic-info-section/server-basic-info-section.component';
import ServerServicesSection from 'components/server-services-section/server-services-section.component';
import ServerDomainsSection from 'components/server-domains-section/server-domains-section.component';

const useStyles = makeStyles({
  button: {
    display: 'flex',
    margin: '0 auto'
  }
});

const ServerDetailsPage = () => {
  const classes = useStyles();

  const { id } = useParams();

  const { currentServer, isFetchingCurrentServer, error } = useSelector(
    state => state.server
  );

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    dispatch(fetchServerStart(id));

    return () => dispatch(setCurrentServer(null));
  }, [dispatch, id]);

  useEffect(() => {
    if (error)
      if (error.message === 'Server not found')
        history.push(ROUTE_PATHS.NOT_FOUND);
  }, [error, history]);

  const handleDeleteButtonClick = () =>
    dispatch(setServerDeleteConfirmationModalOpen(true));

  const handleHeaderButtonClick = () => history.push(ROUTE_PATHS.SERVERS);

  if (isFetchingCurrentServer) return <Spinner />;

  if (currentServer)
    return (
      <BasePage
        title={currentServer.name}
        subtitle='Manage server’s basic info, services, domains, metrics and more'
        showHeaderButton
        tooltipTitle='Back to Servers Page'
        headerButtonOnClick={handleHeaderButtonClick}
      >
        <ServerBasicInfoSection />

        <ServerServicesSection />

        <ServerDomainsSection />

        <Section title='Danger zone'>
          <Button
            variant='outlined'
            color='secondary'
            className={classes.button}
            startIcon={<Delete />}
            onClick={handleDeleteButtonClick}
          >
            Delete this server
          </Button>
        </Section>
      </BasePage>
    );

  return null;
};

export default ServerDetailsPage;
