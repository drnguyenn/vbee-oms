import ModalActionTypes from './modal.types';

const INITIAL_STATE = {
  openPreferencesModal: false,

  openClusterCreationModal: false,
  openClusterDeleteConfirmationModal: false,
  openClusterMemberAdditionModal: false,
  openClusterMemberRemovalConfirmationModal: false,

  openServerCreationModal: false,
  openServerDeleteConfirmationModal: false,
  openServerDomainAdditionModal: false,
  openServerDomainUpdateModal: false,
  openServerDomainRemovalConfirmationModal: false,

  openRepositoryMemberAdditionModal: false,
  openRepositoryMemberRemovalConfirmationModal: false,

  openServiceCreationModal: false,
  openServiceDeleteConfirmationModal: false,
  openServiceMemberAdditionModal: false,
  openServiceMemberRemovalConfirmationModal: false,

  openClusterDiagramNodeRemovalConfirmationModal: false,
  openClusterDiagramElementsRemovalConfirmationModal: false,

  openUserCreationModal: false,
  openUserDeleteConfirmationModal: false,
  openRemovingUserFromAllClustersConfirmationModal: false,
  openRemovingUserFromAllServicesConfirmationModal: false,
  openRemovingUserFromAllReposConfirmationModal: false
};

const modalReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case ModalActionTypes.SET_PREFERENCES_MODAL_OPEN:
      return {
        ...state,
        openPreferencesModal: payload
      };

    case ModalActionTypes.SET_CLUSTER_CREATION_MODAL_OPEN:
      return {
        ...state,
        openClusterCreationModal: payload
      };

    case ModalActionTypes.SET_CLUSTER_DELETE_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openClusterDeleteConfirmationModal: payload
      };

    case ModalActionTypes.SET_CLUSTER_MEMBER_ADDITION_MODAL_OPEN:
      return {
        ...state,
        openClusterMemberAdditionModal: payload
      };

    case ModalActionTypes.SET_CLUSTER_MEMBER_REMOVAL_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openClusterMemberRemovalConfirmationModal: payload
      };

    case ModalActionTypes.SET_SERVER_CREATION_MODAL_OPEN:
      return {
        ...state,
        openServerCreationModal: payload
      };

    case ModalActionTypes.SET_SERVER_DELETE_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openServerDeleteConfirmationModal: payload
      };

    case ModalActionTypes.SET_SERVER_DOMAIN_ADDITION_MODAL_OPEN:
      return {
        ...state,
        openServerDomainAdditionModal: payload
      };

    case ModalActionTypes.SET_SERVER_DOMAIN_UPDATE_MODAL_OPEN:
      return {
        ...state,
        openServerDomainUpdateModal: payload
      };

    case ModalActionTypes.SET_SERVER_DOMAIN_REMOVAL_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openServerDomainRemovalConfirmationModal: payload
      };

    case ModalActionTypes.SET_REPOSITORY_MEMBER_ADDITION_MODAL_OPEN:
      return {
        ...state,
        openRepositoryMemberAdditionModal: payload
      };

    case ModalActionTypes.SET_REPOSITORY_MEMBER_REMOVAL_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openRepositoryMemberRemovalConfirmationModal: payload
      };

    case ModalActionTypes.SET_SERVICE_CREATION_MODAL_OPEN:
      return {
        ...state,
        openServiceCreationModal: payload
      };

    case ModalActionTypes.SET_SERVICE_DELETE_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openServiceDeleteConfirmationModal: payload
      };

    case ModalActionTypes.SET_SERVICE_MEMBER_ADDITION_MODAL_OPEN:
      return {
        ...state,
        openServiceMemberAdditionModal: payload
      };

    case ModalActionTypes.SET_SERVICE_MEMBER_REMOVAL_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openServiceMemberRemovalConfirmationModal: payload
      };

    case ModalActionTypes.SET_CLUSTER_DIAGRAM_NODE_REMOVAL_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openClusterDiagramNodeRemovalConfirmationModal: payload
      };

    case ModalActionTypes.SET_CLUSTER_DIAGRAM_ELEMENTS_REMOVAL_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openClusterDiagramElementsRemovalConfirmationModal: payload
      };

    case ModalActionTypes.SET_USER_CREATION_MODAL_OPEN:
      return {
        ...state,
        openUserCreationModal: payload
      };

    case ModalActionTypes.SET_USER_DELETE_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openUserDeleteConfirmationModal: payload
      };

    case ModalActionTypes.SET_REMOVING_USER_FROM_ALL_CLUSTERS_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openRemovingUserFromAllClustersConfirmationModal: payload
      };

    case ModalActionTypes.SET_REMOVING_USER_FROM_ALL_SERVICES_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openRemovingUserFromAllServicesConfirmationModal: payload
      };

    case ModalActionTypes.SET_REMOVING_USER_FROM_ALL_REPOS_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openRemovingUserFromAllReposConfirmationModal: payload
      };

    default:
      return state;
  }
};

export default modalReducer;
