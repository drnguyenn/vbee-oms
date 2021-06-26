import { useSelector } from 'react-redux';

import PreferencesModal from './preferences/preferences.component';
import ClusterCreationModal from './cluster-creation/cluster-creation.component';
import ClusterDeleteConfirmationModal from './cluster-delete-confirmation/cluster-delete-confirmation.component';
import ClusterMemberAdditionModal from './cluster-member-addition/cluster-member-addition.component';
import ClusterMemberRemovalConfirmationModal from './cluster-member-removal-confirmation/cluster-member-removal-confirmation.component';
import ServiceCreationModal from './service-creation/service-creation.component';
import ServiceDeleteConfirmationModal from './service-delete-confirmation/service-delete-confirmation.component';
import ServiceMemberAdditionModal from './service-member-addition/service-member-addition.component';
import ServiceMemberRemovalConfirmationModal from './service-member-removal-confirmation/service-member-removal-confirmation.component';
import DiagramNodeRemovalConfirmationModal from './diagram-node-removal-confirmation/diagram-node-removal-confirmation.component';
import DiagramElementsRemovalConfirmationModal from './diagram-elements-removal-confirmation/diagram-elements-removal-confirmation.component';
import ServerDomainAdditionModal from './server-domain-addition/server-domain-addition.component';
import ServerDomainUpdateModal from './server-domain-update/server-domain-update.component';
import ServerDomainRemovalConfirmationModal from './server-domain-removal-confirmation/server-domain-removal-confirmation.component';

const ModalRegistrar = () => {
  const {
    openPreferencesModal,

    openClusterCreationModal,
    openClusterDeleteConfirmationModal,
    openClusterMemberAdditionModal,
    openClusterMemberRemovalConfirmationModal,

    openServiceCreationModal,
    openServiceDeleteConfirmationModal,
    openServiceMemberAdditionModal,
    openServiceMemberRemovalConfirmationModal,

    openClusterDiagramNodeRemovalConfirmationModal,
    openClusterDiagramElementsRemovalConfirmationModal,

    openServerDomainAdditionModal,
    openServerDomainUpdateModal,
    openServerDomainRemovalConfirmationModal
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

      {openServerDomainAdditionModal && <ServerDomainAdditionModal />}
      {openServerDomainUpdateModal && <ServerDomainUpdateModal />}
      {openServerDomainRemovalConfirmationModal && (
        <ServerDomainRemovalConfirmationModal />
      )}
    </>
  );
};

export default ModalRegistrar;
