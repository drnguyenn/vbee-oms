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
  openClusterDiagramElementsRemoveConfirmationModal: false
};

const modalReducer = (state = INITIAL_STATE, action) => {
  const { type } = action;

  switch (type) {
    case ModalActionTypes.TOGGLE_PREFERENCES_MODAL:
      return {
        ...state,
        openPreferencesModal: !state.openPreferencesModal
      };

    case ModalActionTypes.TOGGLE_CLUSTER_CREATION_MODAL:
      return {
        ...state,
        openClusterCreationModal: !state.openClusterCreationModal
      };

    case ModalActionTypes.TOGGLE_CLUSTER_DELETE_CONFIRMATION_MODAL:
      return {
        ...state,
        openClusterDeleteConfirmationModal:
          !state.openClusterDeleteConfirmationModal
      };

    case ModalActionTypes.TOGGLE_CLUSTER_MEMBER_ADDITION_MODAL:
      return {
        ...state,
        openClusterMemberAdditionModal: !state.openClusterMemberAdditionModal
      };

    case ModalActionTypes.TOGGLE_CLUSTER_MEMBER_REMOVE_CONFIRMATION_MODAL:
      return {
        ...state,
        openClusterMemberRemoveConfirmationModal:
          !state.openClusterMemberRemoveConfirmationModal
      };

    case ModalActionTypes.TOGGLE_SERVICE_CREATION_MODAL:
      return {
        ...state,
        openServiceCreationModal: !state.openServiceCreationModal
      };

    case ModalActionTypes.TOGGLE_SERVICE_DELETE_CONFIRMATION_MODAL:
      return {
        ...state,
        openServiceDeleteConfirmationModal:
          !state.openServiceDeleteConfirmationModal
      };

    case ModalActionTypes.TOGGLE_SERVICE_MEMBER_ADDITION_MODAL:
      return {
        ...state,
        openServiceMemberAdditionModal: !state.openServiceMemberAdditionModal
      };

    case ModalActionTypes.TOGGLE_SERVICE_MEMBER_REMOVE_CONFIRMATION_MODAL:
      return {
        ...state,
        openServiceMemberRemoveConfirmationModal:
          !state.openServiceMemberRemoveConfirmationModal
      };

    case ModalActionTypes.TOGGLE_CLUSTER_DIAGRAM_NODE_REMOVE_CONFIRMATION_MODAL:
      return {
        ...state,
        openClusterDiagramNodeRemoveConfirmationModal:
          !state.openClusterDiagramNodeRemoveConfirmationModal
      };

    case ModalActionTypes.TOGGLE_CLUSTER_DIAGRAM_ELEMENTS_REMOVE_CONFIRMATION_MODAL:
      return {
        ...state,
        openClusterDiagramElementsRemoveConfirmationModal:
          !state.openClusterDiagramElementsRemoveConfirmationModal
      };

    default:
      return state;
  }
};

export default modalReducer;
