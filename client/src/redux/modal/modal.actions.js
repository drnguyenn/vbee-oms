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

export const setClusterMemberRemovalConfirmationModalOpen = open => ({
  type: ModalActionTypes.SET_CLUSTER_MEMBER_REMOVAL_CONFIRMATION_MODAL_OPEN,
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

export const setServerDomainRemovalConfirmationModalOpen = open => ({
  type: ModalActionTypes.SET_SERVER_DOMAIN_REMOVAL_CONFIRMATION_MODAL_OPEN,
  payload: open
});

export const setRepositoryMemberAdditionModalOpen = open => ({
  type: ModalActionTypes.SET_REPOSITORY_MEMBER_ADDITION_MODAL_OPEN,
  payload: open
});

export const setRepositoryMemberRemovalConfirmationModalOpen = open => ({
  type: ModalActionTypes.SET_REPOSITORY_MEMBER_REMOVAL_CONFIRMATION_MODAL_OPEN,
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

export const setServiceMemberRemovalConfirmationModalOpen = open => ({
  type: ModalActionTypes.SET_SERVICE_MEMBER_REMOVAL_CONFIRMATION_MODAL_OPEN,
  payload: open
});

export const setUserCreationModalOpen = open => ({
  type: ModalActionTypes.SET_USER_CREATION_MODAL_OPEN,
  payload: open
});

export const setUserDeleteConfirmationModalOpen = open => ({
  type: ModalActionTypes.SET_USER_DELETE_CONFIRMATION_MODAL_OPEN,
  payload: open
});

export const setDiagramNodeRemovalConfirmationModalOpen = open => ({
  type: ModalActionTypes.SET_CLUSTER_DIAGRAM_NODE_REMOVAL_CONFIRMATION_MODAL_OPEN,
  payload: open
});

export const setDiagramElementsRemovalConfirmationModalOpen = open => ({
  type: ModalActionTypes.SET_CLUSTER_DIAGRAM_ELEMENTS_REMOVAL_CONFIRMATION_MODAL_OPEN,
  payload: open
});
