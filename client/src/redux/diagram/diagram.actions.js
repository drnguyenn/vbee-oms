import DiagramActionTypes from './diagram.types';

export const fetchClusterDiagramStart = clusterId => ({
  type: DiagramActionTypes.FETCH_CLUSTER_DIAGRAM_START,
  payload: clusterId
});

export const fetchClusterDiagramSuccess = diagram => ({
  type: DiagramActionTypes.FETCH_CLUSTER_DIAGRAM_SUCCESS,
  payload: diagram
});

export const fetchClusterDiagramFailure = error => ({
  type: DiagramActionTypes.FETCH_CLUSTER_DIAGRAM_FAILURE,
  payload: error
});

export const setSelectedDiagramNode = node => ({
  type: DiagramActionTypes.SET_SELECTED_DIAGRAM_NODE,
  payload: node
});

export const setSelectedDiagramElements = elements => ({
  type: DiagramActionTypes.SET_SELECTED_DIAGRAM_ELEMENTS,
  payload: elements
});

export const updateClusterDiagramElementsStart = elements => ({
  type: DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_ELEMENTS_START,
  payload: { elements }
});

export const updateClusterDiagramElementsSuccess = () => ({
  type: DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_ELEMENTS_SUCCESS
});

export const updateClusterDiagramElementsFailure = error => ({
  type: DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_ELEMENTS_FAILURE,
  payload: error
});

export const removeClusterDiagramElementsStart = (elements, callback) => ({
  type: DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_ELEMENTS_START,
  payload: { elements, callback }
});

export const removeClusterDiagramElementsSuccess = () => ({
  type: DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_ELEMENTS_SUCCESS
});

export const removeClusterDiagramElementsFailure = error => ({
  type: DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_ELEMENTS_FAILURE,
  payload: error
});

export const addClusterDiagramNodeStart = node => ({
  type: DiagramActionTypes.ADD_CLUSTER_DIAGRAM_NODE_START,
  payload: { node }
});

export const addClusterDiagramNodeSuccess = node => ({
  type: DiagramActionTypes.ADD_CLUSTER_DIAGRAM_NODE_SUCCESS,
  payload: node
});

export const addClusterDiagramNodeFailure = error => ({
  type: DiagramActionTypes.ADD_CLUSTER_DIAGRAM_NODE_FAILURE,
  payload: error
});

export const updateClusterDiagramNodeStart = (nodeId, data) => ({
  type: DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_NODE_START,
  payload: { nodeId, data }
});

export const updateClusterDiagramNodeSuccess = node => ({
  type: DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_NODE_SUCCESS,
  payload: node
});

export const updateClusterDiagramNodeFailure = error => ({
  type: DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_NODE_FAILURE,
  payload: error
});

export const removeClusterDiagramNodeStart = (nodeId, callback) => ({
  type: DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_NODE_START,
  payload: { nodeId, callback }
});

export const removeClusterDiagramNodeSuccess = node => ({
  type: DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_NODE_SUCCESS,
  payload: node
});

export const removeClusterDiagramNodeFailure = error => ({
  type: DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_NODE_FAILURE,
  payload: error
});

export const addClusterDiagramPortStart = port => ({
  type: DiagramActionTypes.ADD_CLUSTER_DIAGRAM_PORT_START,
  payload: { port }
});

export const addClusterDiagramPortSuccess = port => ({
  type: DiagramActionTypes.ADD_CLUSTER_DIAGRAM_PORT_SUCCESS,
  payload: port
});

export const addClusterDiagramPortFailure = error => ({
  type: DiagramActionTypes.ADD_CLUSTER_DIAGRAM_PORT_FAILURE,
  payload: error
});

export const updateClusterDiagramPortStart = (portId, data) => ({
  type: DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_PORT_START,
  payload: { portId, data }
});

export const updateClusterDiagramPortSuccess = port => ({
  type: DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_PORT_SUCCESS,
  payload: port
});

export const updateClusterDiagramPortFailure = error => ({
  type: DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_PORT_FAILURE,
  payload: error
});

export const removeClusterDiagramPortStart = (portId, callback) => ({
  type: DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_PORT_START,
  payload: { portId, callback }
});

export const removeClusterDiagramPortSuccess = port => ({
  type: DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_PORT_SUCCESS,
  payload: port
});

export const removeClusterDiagramPortFailure = error => ({
  type: DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_PORT_FAILURE,
  payload: error
});

export const addClusterDiagramLinkStart = (link, callback) => ({
  type: DiagramActionTypes.ADD_CLUSTER_DIAGRAM_LINK_START,
  payload: { link, callback }
});

export const addClusterDiagramLinkSuccess = link => ({
  type: DiagramActionTypes.ADD_CLUSTER_DIAGRAM_LINK_SUCCESS,
  payload: link
});

export const addClusterDiagramLinkFailure = error => ({
  type: DiagramActionTypes.ADD_CLUSTER_DIAGRAM_LINK_FAILURE,
  payload: error
});

export const updateClusterDiagramLinkStart = (linkId, data) => ({
  type: DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_LINK_START,
  payload: { linkId, data }
});

export const updateClusterDiagramLinkSuccess = link => ({
  type: DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_LINK_SUCCESS,
  payload: link
});

export const updateClusterDiagramLinkFailure = error => ({
  type: DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_LINK_FAILURE,
  payload: error
});

export const removeClusterDiagramLinkStart = (linkId, callback) => ({
  type: DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_LINK_START,
  payload: { linkId, callback }
});

export const removeClusterDiagramLinkSuccess = link => ({
  type: DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_LINK_SUCCESS,
  payload: link
});

export const removeClusterDiagramLinkFailure = error => ({
  type: DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_LINK_FAILURE,
  payload: error
});
