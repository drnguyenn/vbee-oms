import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchRepositoryStart,
  setCurrentRepository
} from 'redux/repository/repository.actions';

import ROUTE_PATHS from 'router/route-paths';

import BasePage from 'pages/base/base.component';

import Spinner from 'components/spinner/spinner.component';
import RepositoryBasicInfoSection from 'components/repository-basic-info-section/repository-basic-info-section.component';
import RepositoryServicesSection from 'components/repository-services-section/repository-services-section.component';
import RepositoryMembersSection from 'components/repository-members-section/repository-members-section.component';

const RepositoryDetailsPage = () => {
  const { id } = useParams();

  const { currentRepository, isFetchingCurrentRepository, error } = useSelector(
    state => state.repository
  );

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    dispatch(fetchRepositoryStart(id));

    return () => dispatch(setCurrentRepository(null));
  }, [dispatch, id]);

  useEffect(() => {
    if (error)
      if (error.message === 'Repository not found')
        history.replace(ROUTE_PATHS.NOT_FOUND);
  }, [error, history]);

  const handleHeaderButtonClick = () => history.push(ROUTE_PATHS.REPOSITORIES);

  if (isFetchingCurrentRepository) return <Spinner />;

  if (currentRepository)
    return (
      <BasePage
        title={currentRepository.name}
        subtitle='Manage repository’s basic info, architecture, services and more'
        showHeaderButton
        tooltipTitle='Back to Repositories Page'
        headerButtonOnClick={handleHeaderButtonClick}
      >
        <RepositoryBasicInfoSection />

        <RepositoryServicesSection />

        <RepositoryMembersSection />
      </BasePage>
    );

  return null;
};

export default RepositoryDetailsPage;
