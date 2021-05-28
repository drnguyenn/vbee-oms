import { debounce, isEmpty } from 'lodash';

import store from '../redux/store';

import { updateClusterDiagramElementsStart } from '../redux/diagram/diagram.actions';

import {
  DEBOUNCE_DIAGRAM_UPDATE_WAIT_TIME,
  DEBOUNCE_DIAGRAM_UPDATE_MAX_WAIT_TIME
} from '../constants';

const initialChanges = {
  nodes: {},
  ports: {},
  links: {}
};

let diagramChanges = initialChanges;

export const getDiagramChanges = () => diagramChanges;

export const setDiagramChanges = changes => {
  diagramChanges = changes;
};

export const removeElementsChanges = (paths = []) =>
  paths.forEach(path => {
    const [elementType, id] = path.split('.');
    delete diagramChanges[elementType][id];
  });

export const debouncedUpdateDiagram = debounce(
  () => {
    const { nodes, ports, links } = diagramChanges;

    if (!isEmpty({ ...nodes, ...ports, ...links }))
      store.dispatch(updateClusterDiagramElementsStart(diagramChanges));

    setDiagramChanges(initialChanges);
  },
  DEBOUNCE_DIAGRAM_UPDATE_WAIT_TIME,
  {
    maxWait: DEBOUNCE_DIAGRAM_UPDATE_MAX_WAIT_TIME
  }
);
