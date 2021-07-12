import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Button, makeStyles } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

import { fetchUserStart, setSelectedUser } from 'redux/user/user.actions';
import { setUserDeleteConfirmationModalOpen } from 'redux/modal/modal.actions';

import ROUTE_PATHS from 'router/route-paths';

import BasePage from 'pages/base/base.component';

import Spinner from 'components/spinner/spinner.component';
import Section from 'components/section/section.component';
import UserBasicInfoSection from 'components/user-basic-info-section/user-basic-info-section.component';
import UserClustersSection from 'components/user-clusters-section/user-clusters-section.component';
import UserServicesSection from 'components/user-services-section/user-services-section.component';
import UserRepositoriesSection from 'components/user-repositories-section/user-repositories-section.component';

const useStyles = makeStyles({
  button: {
    display: 'flex',
    margin: '0 auto'
  }
});

const UserDetailsPage = () => {
  const classes = useStyles();

  const { id } = useParams();

  const { selectedUser, isFetchingCurrentUser, error } = useSelector(
    state => state.user
  );

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    dispatch(fetchUserStart(id));

    return () => dispatch(setSelectedUser(null));
  }, [dispatch, id]);

  useEffect(() => {
    if (error)
      if (error.message === 'User not found')
        history.push(ROUTE_PATHS.NOT_FOUND);
  }, [error, history]);

  const handleDeleteButtonClick = () =>
    dispatch(setUserDeleteConfirmationModalOpen(true));

  const handleHeaderButtonClick = () => history.push(ROUTE_PATHS.USERS);

  if (isFetchingCurrentUser) return <Spinner />;

  if (selectedUser)
    return (
      <BasePage
        title={selectedUser.fullName || selectedUser.username}
        subtitle='Manage user’s basic info, clusters, services, and repositories they have joined'
        showHeaderButton
        tooltipTitle='Back to Users Page'
        headerButtonOnClick={handleHeaderButtonClick}
      >
        <UserBasicInfoSection />

        <UserClustersSection />

        <UserServicesSection />

        <UserRepositoriesSection />

        <Section title='Danger zone'>
          <Button
            variant='outlined'
            color='secondary'
            className={classes.button}
            startIcon={<Delete />}
            onClick={handleDeleteButtonClick}
          >
            Delete this user account
          </Button>
        </Section>
      </BasePage>
    );

  return null;
};

export default UserDetailsPage;
