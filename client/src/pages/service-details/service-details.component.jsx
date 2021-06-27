import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Button, makeStyles } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

import {
  fetchServiceStart,
  setCurrentService
} from 'redux/service/service.actions';
import { setServiceDeleteConfirmationModalOpen } from 'redux/modal/modal.actions';

import ROUTE_PATHS from 'router/route-paths';

import BasePage from 'pages/base/base.component';
import Spinner from 'components/spinner/spinner.component';
import Section from 'components/section/section.component';
import ServiceBasicInfoSection from 'components/service-basic-info-section/service-basic-info-section.component';
import ServiceMembersSection from 'components/service-members-section/service-members-section.component';

const useStyles = makeStyles({
  button: {
    display: 'flex',
    margin: '0 auto'
  }
});

const ServiceDetailsPage = () => {
  const classes = useStyles();

  const { id } = useParams();

  const { currentService, isFetchingCurrentService, error } = useSelector(
    state => state.service
  );

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    dispatch(fetchServiceStart(id));

    return () => dispatch(setCurrentService(null));
  }, [dispatch, id]);

  useEffect(() => {
    if (error)
      if (error.message === 'Service not found')
        history.push(ROUTE_PATHS.NOT_FOUND);
  }, [error, history]);

  const handleDeleteButtonClick = () =>
    dispatch(setServiceDeleteConfirmationModalOpen(true));

  const handleHeaderButtonClick = () => history.push(ROUTE_PATHS.SERVICES);

  if (isFetchingCurrentService) return <Spinner />;

  if (currentService)
    return (
      <BasePage
        title={currentService.name}
        subtitle='Manage service’s basic info, repositories, servers and more'
        showHeaderButton
        tooltipTitle='Back to Service Page'
        headerButtonOnClick={handleHeaderButtonClick}
      >
        <ServiceBasicInfoSection />

        <ServiceMembersSection />

        <Section title='Danger zone'>
          <Button
            variant='outlined'
            color='secondary'
            className={classes.button}
            startIcon={<Delete />}
            onClick={handleDeleteButtonClick}
          >
            Delete this service
          </Button>
        </Section>
      </BasePage>
    );

  return null;
};

export default ServiceDetailsPage;
