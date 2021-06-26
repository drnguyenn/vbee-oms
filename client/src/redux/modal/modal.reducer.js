import ModalActionTypes from './modal.types';

const INITIAL_STATE = {
  openPreferencesModal: false,

  openClusterCreationModal: false,
  openClusterDeleteConfirmationModal: false,
  openClusterMemberAdditionModal: false,
  openClusterMemberRemoveConfirmationModal: false,

  openServiceCreationModal: false,
  openServiceDeleteConfirmationModal: false,
  openServiceMemberAdditionModal: false,
  openServiceMemberRemoveConfirmationModal: false,

  openClusterDiagramNodeRemoveConfirmationModal: false,
  openClusterDiagramElementsRemoveConfirmationModal: false,

  openServerDomainAdditionModal: false,
  openServerDomainUpdateModal: false,
  openServerDomainRemoveConfirmationModal: false
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
        openClusterMemberRemoveConfirmationModal: payload
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
        openServiceMemberRemoveConfirmationModal: payload
      };

    case ModalActionTypes.SET_CLUSTER_DIAGRAM_NODE_REMOVE_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openClusterDiagramNodeRemoveConfirmationModal: payload
      };

    case ModalActionTypes.SET_CLUSTER_DIAGRAM_ELEMENTS_REMOVE_CONFIRMATION_MODAL_OPEN:
      return {
        ...state,
        openClusterDiagramElementsRemoveConfirmationModal: payload
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
        openServerDomainRemoveConfirmationModal: payload
      };

    default:
      return state;
  }
};

export default modalReducer;
