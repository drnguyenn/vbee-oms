import { useSelector } from 'react-redux';

import PreferencesModal from './preferences/preferences.component';
import ClusterCreationModal from './cluster-creation/cluster-creation.component';
import ClusterDeleteConfirmationModal from './cluster-delete-confirmation/cluster-delete-confirmation.component';
import ClusterMemberAdditionModal from './cluster-member-addition/cluster-member-addition.component';
import ClusterMemberRemoveConfirmationModal from './cluster-member-remove-confirmation/cluster-member-remove-confirmation.component';
import ServiceCreationModal from './service-creation/service-creation.component';
import ServiceDeleteConfirmationModal from './service-delete-confirmation/service-delete-confirmation.component';
import ServiceMemberAdditionModal from './service-member-addition/service-member-addition.component';
import ServiceMemberRemoveConfirmationModal from './service-member-remove-confirmation/service-member-remove-confirmation.component';
import DiagramNodeRemoveConfirmationModal from './diagram-node-remove-confirmation/diagram-node-remove-confirmation.component';
import DiagramElementsRemoveConfirmationModal from './diagram-elements-remove-confirmation/diagram-elements-remove-confirmation.component';
import ServerDomainAdditionModal from './server-domain-addition/server-domain-addition.component';
import ServerDomainUpdateModal from './server-domain-update/server-domain-update.component';
import ServerDomainRemoveConfirmationModal from './server-domain-remove-confirmation/server-domain-remove-confirmation.component';

const ModalRegistrar = () => {
  const {
    openPreferencesModal,

    openClusterCreationModal,
    openClusterDeleteConfirmationModal,
    openClusterMemberAdditionModal,
    openClusterMemberRemoveConfirmationModal,

    openServiceCreationModal,
    openServiceDeleteConfirmationModal,
    openServiceMemberAdditionModal,
    openServiceMemberRemoveConfirmationModal,

    openClusterDiagramNodeRemoveConfirmationModal,
    openClusterDiagramElementsRemoveConfirmationModal,

    openServerDomainAdditionModal,
    openServerDomainUpdateModal,
    openServerDomainRemoveConfirmationModal
  } = useSelector(state => state.modal);

  return (
    <>
      {openPreferencesModal && <PreferencesModal />}

      {openClusterCreationModal && <ClusterCreationModal />}
      {openClusterDeleteConfirmationModal && <ClusterDeleteConfirmationModal />}
      {openClusterMemberAdditionModal && <ClusterMemberAdditionModal />}
      {openClusterMemberRemoveConfirmationModal && (
        <ClusterMemberRemoveConfirmationModal />
      )}

      {openServiceCreationModal && <ServiceCreationModal />}
      {openServiceDeleteConfirmationModal && <ServiceDeleteConfirmationModal />}
      {openServiceMemberAdditionModal && <ServiceMemberAdditionModal />}
      {openServiceMemberRemoveConfirmationModal && (
        <ServiceMemberRemoveConfirmationModal />
      )}

      {openClusterDiagramNodeRemoveConfirmationModal && (
        <DiagramNodeRemoveConfirmationModal />
      )}
      {openClusterDiagramElementsRemoveConfirmationModal && (
        <DiagramElementsRemoveConfirmationModal />
      )}

      {openServerDomainAdditionModal && <ServerDomainAdditionModal />}
      {openServerDomainUpdateModal && <ServerDomainUpdateModal />}
      {openServerDomainRemoveConfirmationModal && (
        <ServerDomainRemoveConfirmationModal />
      )}
    </>
  );
};

export default ModalRegistrar;
