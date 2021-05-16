import ModalActionTypes from './modal.types';

export const togglePreferencesModal = () => ({
  type: ModalActionTypes.TOGGLE_PREFERENCES_MODAL
});

export const toggleClusterCreationModal = () => ({
  type: ModalActionTypes.TOGGLE_CLUSTER_CREATION_MODAL
});

export const toggleClusterDeleteConfirmationModal = () => ({
  type: ModalActionTypes.TOGGLE_CLUSTER_DELETE_CONFIRMATION_MODAL
});

export const toggleClusterMemberAdditionModal = () => ({
  type: ModalActionTypes.TOGGLE_CLUSTER_MEMBER_ADDITION_MODAL
});

export const toggleClusterMemberRemoveConfirmationModal = () => ({
  type: ModalActionTypes.TOGGLE_CLUSTER_MEMBER_REMOVE_CONFIRMATION_MODAL
});

export const toggleServiceCreationModal = () => ({
  type: ModalActionTypes.TOGGLE_SERVICE_CREATION_MODAL
});

export const toggleServiceDeleteConfirmationModal = () => ({
  type: ModalActionTypes.TOGGLE_SERVICE_DELETE_CONFIRMATION_MODAL
});

export const toggleServiceMemberAdditionModal = () => ({
  type: ModalActionTypes.TOGGLE_SERVICE_MEMBER_ADDITION_MODAL
});

export const toggleServiceMemberRemoveConfirmationModal = () => ({
  type: ModalActionTypes.TOGGLE_SERVICE_MEMBER_REMOVE_CONFIRMATION_MODAL
});

export const toggleDiagramNodeRemoveConfirmationModal = () => ({
  type: ModalActionTypes.TOGGLE_CLUSTER_DIAGRAM_NODE_REMOVE_CONFIRMATION_MODAL
});

export const toggleDiagramElementsRemoveConfirmationModal = () => ({
  type: ModalActionTypes.TOGGLE_CLUSTER_DIAGRAM_ELEMENTS_REMOVE_CONFIRMATION_MODAL
});
