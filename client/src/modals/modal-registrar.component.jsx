import React from 'react';
import ReactDOM from 'react-dom';

import { useSelector } from 'react-redux';

import PreferencesModal from './preferences/preferences.component';
import ClusterCreationModal from './cluster-creation/cluster-creation.component';
import ClusterDeleteConfirmationModal from './cluster-delete-confirmation/cluster-delete-confirmation.component';
import ClusterMemberAdditionModal from './cluster-member-addition/cluster-member-addition.component';
import ClusterMemberRemoveConfirmationModal from './cluster-member-remove-confirmation/cluster-member-remove-confirmation.component';
import ServiceCreationModal from './service-creation/service-creation.component';
import ServiceDeleteConfirmationModal from './service-delete-confirmation/service-delete-confirmation.component';

const ModalRegistrar = () => {
  const {
    openPreferencesModal,
    openClusterCreationModal,
    openClusterDeleteConfirmationModal,
    openClusterMemberAdditionModal,
    openClusterMemberRemoveConfirmationModal,
    openServiceCreationModal,
    openServiceDeleteConfirmationModal
  } = useSelector(state => state.modal);

  return ReactDOM.createPortal(
    <>
      {openPreferencesModal && <PreferencesModal />}
      {openClusterCreationModal && <ClusterCreationModal />}
      {openClusterDeleteConfirmationModal && <ClusterDeleteConfirmationModal />}
      {openClusterMemberAdditionModal && <ClusterMemberAdditionModal />}
      {openServiceCreationModal && <ServiceCreationModal />}
      {openServiceDeleteConfirmationModal && <ServiceDeleteConfirmationModal />}
      {openClusterMemberRemoveConfirmationModal && (
        <ClusterMemberRemoveConfirmationModal />
      )}
    </>,
    document.body
  );
};

export default ModalRegistrar;
