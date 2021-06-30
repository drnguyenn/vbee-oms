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

  openServiceCreationModal: false,
  openServiceDeleteConfirmationModal: false,
  openServiceMemberAdditionModal: false,
  openServiceMemberRemovalConfirmationModal: false,

  openClusterDiagramNodeRemovalConfirmationModal: false,
  openClusterDiagramElementsRemovalConfirmationModal: false
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

    case ModalActionTypes.SET_CLUSTER_MEMBER_REMOVE_CONFIRMATION_MODAL_OPEN:
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

    case ModalActionTypes.SET_SERVER_DOMAIN_REMOVE_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openServerDomainRemovalConfirmationModal: payload
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

    case ModalActionTypes.SET_SERVICE_MEMBER_REMOVE_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openServiceMemberRemovalConfirmationModal: payload
      };

    case ModalActionTypes.SET_CLUSTER_DIAGRAM_NODE_REMOVE_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openClusterDiagramNodeRemovalConfirmationModal: payload
      };

    case ModalActionTypes.SET_CLUSTER_DIAGRAM_ELEMENTS_REMOVE_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openClusterDiagramElementsRemovalConfirmationModal: payload
      };

    default:
      return state;
  }
};

export default modalReducer;
