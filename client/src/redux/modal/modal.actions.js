import ModalActionTypes from './modal.types';

export const setPreferencesModalOpen = open => ({
  type: ModalActionTypes.SET_PREFERENCES_MODAL_OPEN,
  payload: open
});

export const setClusterCreationModalOpen = open => ({
  type: ModalActionTypes.SET_CLUSTER_CREATION_MODAL_OPEN,
  payload: open
});

export const setClusterDeleteConfirmationModalOpen = open => ({
  type: ModalActionTypes.SET_CLUSTER_DELETE_CONFIRMATION_MODAL_OPEN,
  payload: open
});

export const setClusterMemberAdditionModalOpen = open => ({
  type: ModalActionTypes.SET_CLUSTER_MEMBER_ADDITION_MODAL_OPEN,
  payload: open
});

export const setClusterMemberRemoveConfirmationModalOpen = open => ({
  type: ModalActionTypes.SET_CLUSTER_MEMBER_REMOVE_CONFIRMATION_MODAL_OPEN,
  payload: open
});

export const setServiceCreationModalOpen = open => ({
  type: ModalActionTypes.SET_SERVICE_CREATION_MODAL_OPEN,
  payload: open
});

export const setServiceDeleteConfirmationModalOpen = open => ({
  type: ModalActionTypes.SET_SERVICE_DELETE_CONFIRMATION_MODAL_OPEN,
  payload: open
});

export const setServiceMemberAdditionModalOpen = open => ({
  type: ModalActionTypes.SET_SERVICE_MEMBER_ADDITION_MODAL_OPEN,
  payload: open
});

export const setServiceMemberRemoveConfirmationModalOpen = open => ({
  type: ModalActionTypes.SET_SERVICE_MEMBER_REMOVE_CONFIRMATION_MODAL_OPEN,
  payload: open
});

export const setDiagramNodeRemoveConfirmationModalOpen = open => ({
  type: ModalActionTypes.SET_CLUSTER_DIAGRAM_NODE_REMOVE_CONFIRMATION_MODAL_OPEN,
  payload: open
});

export const setDiagramElementsRemoveConfirmationModalOpen = open => ({
  type: ModalActionTypes.SET_CLUSTER_DIAGRAM_ELEMENTS_REMOVE_CONFIRMATION_MODAL_OPEN,
  payload: open
});

export const setServerCreationModalOpen = open => ({
  type: ModalActionTypes.SET_SERVER_CREATION_MODAL_OPEN,
  payload: open
});

export const setServerDeleteConfirmationModalOpen = open => ({
  type: ModalActionTypes.SET_SERVER_DELETE_CONFIRMATION_MODAL_OPEN,
  payload: open
});

export const setServerDomainAdditionModalOpen = open => ({
  type: ModalActionTypes.SET_SERVER_DOMAIN_ADDITION_MODAL_OPEN,
  payload: open
});

export const setServerDomainUpdateModalOpen = open => ({
  type: ModalActionTypes.SET_SERVER_DOMAIN_UPDATE_MODAL_OPEN,
  payload: open
});

export const setServerDomainRemoveConfirmationModalOpen = open => ({
  type: ModalActionTypes.SET_SERVER_DOMAIN_REMOVE_CONFIRMATION_MODAL_OPEN,
  payload: open
});
