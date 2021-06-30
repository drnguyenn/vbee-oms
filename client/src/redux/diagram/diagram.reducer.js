import DiagramActionTypes from './diagram.types';
import ServerActionTypes from '../server/server.types';

const INITIAL_STATE = {
  currentDiagram: null,
  selectedNode: null,
  selectedElements: null,
  isFetchingDiagram: true,
  isSynchronizing: false,
  isFetchingMetrics: false,
  isLinkingNodeToService: false,
  showDrawer: false,
  error: null
};

const diagramReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case DiagramActionTypes.FETCH_CLUSTER_DIAGRAM_START:
      return {
        ...state,
        isFetchingDiagram: true,
        error: null
      };

    case DiagramActionTypes.FETCH_CLUSTER_DIAGRAM_SUCCESS:
      return {
        ...state,
        isFetchingDiagram: false,
        currentDiagram: payload,
        error: null
      };

    case DiagramActionTypes.FETCH_CLUSTER_DIAGRAM_FAILURE:
      return {
        ...state,
        isFetchingDiagram: false,
        currentDiagram: null,
        error: payload
      };

    case DiagramActionTypes.SET_SELECTED_DIAGRAM_NODE:
      return {
        ...state,
        selectedNode: payload
      };

    case DiagramActionTypes.SET_SELECTED_DIAGRAM_ELEMENTS:
      return {
        ...state,
        selectedElements: payload
      };

    case DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_ELEMENTS_START: {
      const { nodes = {}, links = {} } = payload.elements;

      return {
        ...state,
        isSynchronizing: true,
        currentDiagram: {
          ...state.currentDiagram,
          nodes: state.currentDiagram.nodes.map(node =>
            node.id in nodes ? { ...node, ...nodes[node.id] } : node
          ),
          links: state.currentDiagram.links.map(link =>
            link.id in links ? { ...link, ...links[link.id] } : link
          )
        },
        error: null
      };
    }

    case DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_ELEMENTS_SUCCESS:
      return {
        ...state,
        isSynchronizing: false,
        error: null
      };

    case DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_ELEMENTS_START: {
      const { nodes = [], ports = [], links = [] } = payload.elements;

      return {
        ...state,
        isSynchronizing: true,
        currentDiagram: {
          ...state.currentDiagram,
          nodes: state.currentDiagram.nodes.filter(
            node => !nodes.includes(node.id)
          ),
          links: state.currentDiagram.links.filter(
            link =>
              !links.includes(link.id) &&
              !ports.includes(link.sourcePort) &&
              !ports.includes(link.targetPort)
          )
        },
        error: null
      };
    }

    case DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_ELEMENTS_SUCCESS:
      return {
        ...state,
        isSynchronizing: false,
        selectedElements: null,
        error: null
      };

    case DiagramActionTypes.ADD_CLUSTER_DIAGRAM_NODE_START:
    case DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_NODE_START:
    case DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_NODE_START:
    case DiagramActionTypes.ADD_CLUSTER_DIAGRAM_PORT_START:
    case DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_PORT_START:
    case DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_PORT_START:
    case DiagramActionTypes.ADD_CLUSTER_DIAGRAM_LINK_START:
    case DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_LINK_START:
    case DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_LINK_START:
      return {
        ...state,
        isSynchronizing: true,
        error: null
      };

    case DiagramActionTypes.ADD_CLUSTER_DIAGRAM_NODE_SUCCESS:
      return {
        ...state,
        isSynchronizing: false,
        currentDiagram: {
          ...state.currentDiagram,
          nodes: [...state.currentDiagram.nodes, { ...payload }]
        },
        error: null
      };

    case DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_NODE_SUCCESS: {
      const { id, service, ...rest } = payload;

      return {
        ...state,
        isSynchronizing: false,
        currentDiagram: {
          ...state.currentDiagram,
          nodes: state.currentDiagram.nodes.map(node =>
            node.id === payload.id ? { ...node, ...rest } : node
          )
        },
        selectedNode:
          state.selectedNode && state.selectedNode.id === payload.id
            ? {
                ...state.selectedNode,
                ...rest
              }
            : state.selectedNode,
        error: null
      };
    }

    case DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_NODE_SUCCESS: {
      const removedPortIds = payload.ports.map(port => port.id);

      return {
        ...state,
        isSynchronizing: false,
        currentDiagram: {
          ...state.currentDiagram,
          nodes: state.currentDiagram.nodes.filter(
            node => node.id !== payload.id
          ),
          links: state.currentDiagram.links.filter(
            link =>
              !removedPortIds.includes(link.sourcePort) &&
              !removedPortIds.includes(link.targetPort)
          )
        },
        selectedNode: null,
        error: null
      };
    }

    case DiagramActionTypes.ADD_CLUSTER_DIAGRAM_PORT_SUCCESS:
      return {
        ...state,
        isSynchronizing: false,
        currentDiagram: {
          ...state.currentDiagram,
          nodes: state.currentDiagram.nodes.map(node =>
            node.id === payload.node
              ? { ...node, ports: [...node.ports, payload] }
              : node
          )
        },
        error: null
      };

    case DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_PORT_SUCCESS:
      return {
        ...state,
        isSynchronizing: false,
        currentDiagram: {
          ...state.currentDiagram,
          nodes: state.currentDiagram.nodes.map(node =>
            node.id === payload.node
              ? {
                  ...node,
                  ports: node.ports.map(port =>
                    port.id === payload.id ? payload : port
                  )
                }
              : node
          )
        },
        error: null
      };

    case DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_PORT_SUCCESS:
      return {
        ...state,
        isSynchronizing: false,
        currentDiagram: {
          ...state.currentDiagram,
          nodes: state.currentDiagram.nodes.map(node =>
            node.id === payload.node
              ? {
                  ...node,
                  ports: node.ports.filter(port => port.id !== payload.id)
                }
              : node
          ),
          links: state.currentDiagram.links.filter(
            link =>
              link.sourcePort !== payload.id && link.targetPort !== payload.id
          )
        },
        error: null
      };

    case DiagramActionTypes.ADD_CLUSTER_DIAGRAM_LINK_SUCCESS:
      return {
        ...state,
        isSynchronizing: false,
        currentDiagram: {
          ...state.currentDiagram,
          links: [...state.currentDiagram.links, payload]
        },
        error: null
      };

    case DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_LINK_SUCCESS:
      return {
        ...state,
        isSynchronizing: false,
        currentDiagram: {
          ...state.currentDiagram,
          links: state.currentDiagram.links.map(link =>
            link.id === payload.id ? payload : link
          )
        },
        error: null
      };

    case DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_LINK_SUCCESS:
      return {
        ...state,
        isSynchronizing: false,
        currentDiagram: {
          ...state.currentDiagram,
          links: state.currentDiagram.links.filter(
            link => link.id !== payload.id
          )
        },
        error: null
      };

    case ServerActionTypes.FETCH_SERVERS_METRICS_START:
      return {
        ...state,
        isFetchingMetrics: true,
        error: null
      };

    case ServerActionTypes.FETCH_SERVERS_METRICS_SUCCESS: {
      const { selectedNode } = state;

      if (
        selectedNode &&
        selectedNode.service &&
        selectedNode.service.server &&
        selectedNode.service.server.id in payload
      )
        selectedNode.service.server.metrics =
          payload[selectedNode.service.server.id];

      return {
        ...state,
        currentDiagram: {
          ...state.currentDiagram,
          nodes: state.currentDiagram.nodes.map(node => {
            const tempNode = node;

            if (node.service && node.service.server)
              tempNode.service.server.metrics = payload[node.service.server.id];

            return tempNode;
          })
        },
        selectedNode,
        isFetchingMetrics: false,
        error: null
      };
    }

    case ServerActionTypes.FETCH_SERVERS_METRICS_FAILURE:
      return {
        ...state,
        isFetchingMetrics: false,
        error: payload
      };

    case DiagramActionTypes.SET_SHOW_DRAWER:
      return {
        ...state,
        showDrawer: payload
      };

    case DiagramActionTypes.LINK_NODE_TO_SERVICE_START:
      return {
        ...state,
        isLinkingNodeToService: true,
        error: null
      };

    case DiagramActionTypes.LINK_NODE_TO_SERVICE_SUCCESS:
      return {
        ...state,
        isLinkingNodeToService: false,
        currentDiagram: {
          ...state.currentDiagram,
          nodes: state.currentDiagram.nodes.map(node =>
            node.id === payload.id ? { ...node, ...payload } : node
          )
        },
        selectedNode:
          state.selectedNode && state.selectedNode.id === payload.id
            ? {
                ...state.selectedNode,
                ...payload
              }
            : state.selectedNode,
        error: null
      };

    case DiagramActionTypes.LINK_NODE_TO_SERVICE_FAILURE:
      return {
        ...state,
        isLinkingNodeToService: false,
        error: payload
      };

    case DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_ELEMENTS_FAILURE:
    case DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_ELEMENTS_FAILURE:
    case DiagramActionTypes.ADD_CLUSTER_DIAGRAM_NODE_FAILURE:
    case DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_NODE_FAILURE:
    case DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_NODE_FAILURE:
    case DiagramActionTypes.ADD_CLUSTER_DIAGRAM_PORT_FAILURE:
    case DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_PORT_FAILURE:
    case DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_PORT_FAILURE:
    case DiagramActionTypes.ADD_CLUSTER_DIAGRAM_LINK_FAILURE:
    case DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_LINK_FAILURE:
    case DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_LINK_FAILURE:
      return {
        ...state,
        isSynchronizing: false,
        error: payload
      };

    default:
      return state;
  }
};

export default diagramReducer;
