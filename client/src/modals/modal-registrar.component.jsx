import { useSelector } from 'react-redux';

import PreferencesModal from 'modals/preferences/preferences.component';
import ClusterCreationModal from 'modals/cluster-creation/cluster-creation.component';
import ClusterDeleteConfirmationModal from 'modals/cluster-delete-confirmation/cluster-delete-confirmation.component';
import ClusterMemberAdditionModal from 'modals/cluster-member-addition/cluster-member-addition.component';
import ClusterMemberRemovalConfirmationModal from 'modals/cluster-member-removal-confirmation/cluster-member-removal-confirmation.component';
import ServerCreationModal from 'modals/server-creation/server-creation.component';
import ServerDeleteConfirmationModal from 'modals/server-delete-confirmation/server-delete-confirmation.component';
import ServerDomainAdditionModal from 'modals/server-domain-addition/server-domain-addition.component';
import ServerDomainUpdateModal from 'modals/server-domain-update/server-domain-update.component';
import ServerDomainRemovalConfirmationModal from 'modals/server-domain-removal-confirmation/server-domain-removal-confirmation.component';
import ServiceCreationModal from 'modals/service-creation/service-creation.component';
import ServiceDeleteConfirmationModal from 'modals/service-delete-confirmation/service-delete-confirmation.component';
import ServiceMemberAdditionModal from 'modals/service-member-addition/service-member-addition.component';
import ServiceMemberRemovalConfirmationModal from 'modals/service-member-removal-confirmation/service-member-removal-confirmation.component';
import DiagramNodeRemovalConfirmationModal from 'modals/diagram-node-removal-confirmation/diagram-node-removal-confirmation.component';
import DiagramElementsRemovalConfirmationModal from 'modals/diagram-elements-removal-confirmation/diagram-elements-removal-confirmation.component';

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

    openServiceCreationModal,
    openServiceDeleteConfirmationModal,
    openServiceMemberAdditionModal,
    openServiceMemberRemovalConfirmationModal,

    openClusterDiagramNodeRemovalConfirmationModal,
    openClusterDiagramElementsRemovalConfirmationModal
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
    </>
  );
};

export default ModalRegistrar;
