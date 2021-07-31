import { useSelector } from 'react-redux';

import PreferencesModal from './preferences/preferences.component';
import ClusterCreationModal from './cluster-creation/cluster-creation.component';
import ClusterDeleteConfirmationModal from './cluster-delete-confirmation/cluster-delete-confirmation.component';
import ClusterMemberAdditionModal from './cluster-member-addition/cluster-member-addition.component';
import ClusterMemberRemovalConfirmationModal from './cluster-member-removal-confirmation/cluster-member-removal-confirmation.component';
import ServerCreationModal from './server-creation/server-creation.component';
import ServerDeleteConfirmationModal from './server-delete-confirmation/server-delete-confirmation.component';
import ServerDomainAdditionModal from './server-domain-addition/server-domain-addition.component';
import ServerDomainUpdateModal from './server-domain-update/server-domain-update.component';
import ServerDomainRemovalConfirmationModal from './server-domain-removal-confirmation/server-domain-removal-confirmation.component';
import RepositoryMemberAdditionModal from './repository-member-addition/repository-member-addition.component';
import RepositoryMemberRemovalConfirmationModal from './repository-member-removal-confirmation/repository-member-removal-confirmation.component';
import ServiceCreationModal from './service-creation/service-creation.component';
import ServiceDeleteConfirmationModal from './service-delete-confirmation/service-delete-confirmation.component';
import ServiceMemberAdditionModal from './service-member-addition/service-member-addition.component';
import ServiceMemberRemovalConfirmationModal from './service-member-removal-confirmation/service-member-removal-confirmation.component';
import DiagramNodeRemovalConfirmationModal from './diagram-node-removal-confirmation/diagram-node-removal-confirmation.component';
import DiagramElementsRemovalConfirmationModal from './diagram-elements-removal-confirmation/diagram-elements-removal-confirmation.component';
import UserCreationModal from './user-creation/user-creation.component';
import UserDeleteConfirmationModal from './user-delete-confirmation/user-delete-confirmation.component';
import RemovingUserFromAllClustersConfirmationModal from './removing-user-from-all-clusters-confirmation/removing-user-from-all-clusters-confirmation.component';
import RemovingUserFromAllServicesConfirmationModal from './removing-user-from-all-services-confirmation/removing-user-from-all-services-confirmation.component';
import RemovingUserFromAllReposConfirmationModal from './removing-user-from-all-repos-confirmation/removing-user-from-all-repos-confirmation.component';

const ModalRegistrar = () => {
  const {
    openPreferencesModal,

    openClusterCreationModal,
    openClusterDeleteConfirmationModal,
    openClusterMemberAdditionModal,
    openClusterMemberRemovalConfirmationModal,

    openServerCreationModal,
    openServerDeleteConfirmationModal,
    openServerDomainAdditionModal,
    openServerDomainUpdateModal,
    openServerDomainRemovalConfirmationModal,

    openRepositoryMemberAdditionModal,
    openRepositoryMemberRemovalConfirmationModal,

    openServiceCreationModal,
    openServiceDeleteConfirmationModal,
    openServiceMemberAdditionModal,
    openServiceMemberRemovalConfirmationModal,

    openClusterDiagramNodeRemovalConfirmationModal,
    openClusterDiagramElementsRemovalConfirmationModal,

    openUserCreationModal,
    openUserDeleteConfirmationModal,
    openRemovingUserFromAllClustersConfirmationModal,
    openRemovingUserFromAllServicesConfirmationModal,
    openRemovingUserFromAllReposConfirmationModal
  } = useSelector(state => state.modal);

  return (
    <>
      {openPreferencesModal && <PreferencesModal />}

      {openClusterCreationModal && <ClusterCreationModal />}
      {openClusterDeleteConfirmationModal && <ClusterDeleteConfirmationModal />}
      {openClusterMemberAdditionModal && <ClusterMemberAdditionModal />}
      {openClusterMemberRemovalConfirmationModal && (
        <ClusterMemberRemovalConfirmationModal />
      )}

      {openServerCreationModal && <ServerCreationModal />}
      {openServerDeleteConfirmationModal && <ServerDeleteConfirmationModal />}
      {openServerDomainAdditionModal && <ServerDomainAdditionModal />}
      {openServerDomainUpdateModal && <ServerDomainUpdateModal />}
      {openServerDomainRemovalConfirmationModal && (
        <ServerDomainRemovalConfirmationModal />
      )}

      {openRepositoryMemberAdditionModal && <RepositoryMemberAdditionModal />}
      {openRepositoryMemberRemovalConfirmationModal && (
        <RepositoryMemberRemovalConfirmationModal />
      )}

      {openServiceCreationModal && <ServiceCreationModal />}
      {openServiceDeleteConfirmationModal && <ServiceDeleteConfirmationModal />}
      {openServiceMemberAdditionModal && <ServiceMemberAdditionModal />}
      {openServiceMemberRemovalConfirmationModal && (
        <ServiceMemberRemovalConfirmationModal />
      )}

      {openClusterDiagramNodeRemovalConfirmationModal && (
        <DiagramNodeRemovalConfirmationModal />
      )}
      {openClusterDiagramElementsRemovalConfirmationModal && (
        <DiagramElementsRemovalConfirmationModal />
      )}

      {openUserCreationModal && <UserCreationModal />}
      {openUserDeleteConfirmationModal && <UserDeleteConfirmationModal />}
      {openRemovingUserFromAllClustersConfirmationModal && (
        <RemovingUserFromAllClustersConfirmationModal />
      )}
      {openRemovingUserFromAllServicesConfirmationModal && (
        <RemovingUserFromAllServicesConfirmationModal />
      )}
      {openRemovingUserFromAllReposConfirmationModal && (
        <RemovingUserFromAllReposConfirmationModal />
      )}
    </>
  );
};

export default ModalRegistrar;
