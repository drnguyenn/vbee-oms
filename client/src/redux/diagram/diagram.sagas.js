import { takeLatest, all, call, put } from 'redux-saga/effects';

import { Typography } from '@material-ui/core';

import {
  fetchClusterDiagramSuccess,
  fetchClusterDiagramFailure,
  updateClusterDiagramElementsSuccess,
  updateClusterDiagramElementsFailure,
  removeClusterDiagramElementsSuccess,
  removeClusterDiagramElementsFailure,
  addClusterDiagramNodeSuccess,
  addClusterDiagramNodeFailure,
  updateClusterDiagramNodeSuccess,
  updateClusterDiagramNodeFailure,
  removeClusterDiagramNodeSuccess,
  removeClusterDiagramNodeFailure,
  addClusterDiagramPortSuccess,
  addClusterDiagramPortFailure,
  updateClusterDiagramPortSuccess,
  updateClusterDiagramPortFailure,
  removeClusterDiagramPortSuccess,
  removeClusterDiagramPortFailure,
  addClusterDiagramLinkSuccess,
  addClusterDiagramLinkFailure,
  updateClusterDiagramLinkSuccess,
  updateClusterDiagramLinkFailure,
  removeClusterDiagramLinkSuccess,
  removeClusterDiagramLinkFailure,
  linkNodeToServiceSuccess,
  linkNodeToServiceFailure
} from './diagram.actions';
import { notify } from '../notification/notification.actions';

import * as DiagramService from '../../services/diagram.service';

import DiagramActionTypes from './diagram.types';

function* fetchClusterDiagram({ payload }) {
  try {
    const diagram = yield call(DiagramService.fetchClusterDiagram, payload);

    yield put(fetchClusterDiagramSuccess(diagram));
  } catch (error) {
    yield put(fetchClusterDiagramFailure(error));
    yield put(notify('Something went wrong', { variant: 'error' }));
  }
}

function* updateClusterDiagramElements({ payload: { elements } }) {
  try {
    yield call(DiagramService.updateClusterDiagramElements, elements);

    yield put(updateClusterDiagramElementsSuccess());
  } catch (error) {
    yield put(updateClusterDiagramElementsFailure(error));
    yield put(notify('Something went wrong', { variant: 'error' }));
  }
}

function* removeClusterDiagramElements({ payload: { elements, callback } }) {
  try {
    yield call(DiagramService.removeClusterDiagramElements, elements);

    yield call(callback);
    yield put(removeClusterDiagramElementsSuccess());
  } catch (error) {
    yield put(removeClusterDiagramElementsFailure(error));
    yield put(notify('Something went wrong', { variant: 'error' }));
  }
}

function* addClusterDiagramNode({ payload: { node } }) {
  try {
    const diagramNode = yield call(DiagramService.addClusterDiagramNode, node);

    yield put(addClusterDiagramNodeSuccess(diagramNode));
  } catch (error) {
    yield put(addClusterDiagramNodeFailure(error));
    yield put(notify('Something went wrong', { variant: 'error' }));
  }
}

function* updateClusterDiagramNode({ payload: { nodeId, data } }) {
  try {
    const diagramNode = yield call(
      DiagramService.updateClusterDiagramNode,
      nodeId,
      data
    );

    yield put(updateClusterDiagramNodeSuccess(diagramNode));
  } catch (error) {
    yield put(updateClusterDiagramNodeFailure(error));
    yield put(notify('Something went wrong', { variant: 'error' }));
  }
}

function* removeClusterDiagramNode({ payload: { nodeId, callback } }) {
  try {
    const diagramNode = yield call(
      DiagramService.removeClusterDiagramNode,
      nodeId
    );

    yield call(callback);
    yield put(removeClusterDiagramNodeSuccess(diagramNode));
  } catch (error) {
    yield put(removeClusterDiagramNodeFailure(error));
    yield put(notify('Something went wrong', { variant: 'error' }));
  }
}

function* addClusterDiagramPort({ payload: { port } }) {
  try {
    const diagramPort = yield call(DiagramService.addClusterDiagramPort, port);

    yield put(addClusterDiagramPortSuccess(diagramPort));
  } catch (error) {
    yield put(addClusterDiagramPortFailure(error));
    yield put(notify('Something went wrong', { variant: 'error' }));
  }
}

function* updateClusterDiagramPort({ payload: { portId, data } }) {
  try {
    const diagramPort = yield call(
      DiagramService.updateClusterDiagramPort,
      portId,
      data
    );

    yield put(updateClusterDiagramPortSuccess(diagramPort));
  } catch (error) {
    yield put(updateClusterDiagramPortFailure(error));
    yield put(notify('Something went wrong', { variant: 'error' }));
  }
}

function* removeClusterDiagramPort({ payload: { portId, callback } }) {
  try {
    const diagramPort = yield call(
      DiagramService.removeClusterDiagramPort,
      portId
    );

    yield call(callback);
    yield put(removeClusterDiagramPortSuccess(diagramPort));
  } catch (error) {
    yield put(removeClusterDiagramPortFailure(error));
    yield put(notify('Something went wrong', { variant: 'error' }));
  }
}

function* addClusterDiagramLink({ payload: { link, callback } }) {
  try {
    const diagramLink = yield call(DiagramService.addClusterDiagramLink, link);

    yield call(callback);
    yield put(addClusterDiagramLinkSuccess(diagramLink));
  } catch (error) {
    yield put(addClusterDiagramLinkFailure(error));
    yield put(notify('Something went wrong', { variant: 'error' }));
  }
}

function* updateClusterDiagramLink({ payload: { linkId, data } }) {
  try {
    const diagramLink = yield call(
      DiagramService.updateClusterDiagramLink,
      linkId,
      data
    );

    yield put(updateClusterDiagramLinkSuccess(diagramLink));
  } catch (error) {
    yield put(updateClusterDiagramLinkFailure(error));
    yield put(notify('Something went wrong', { variant: 'error' }));
  }
}

function* removeClusterDiagramLink({ payload: { linkId, callback } }) {
  try {
    const diagramLink = yield call(
      DiagramService.removeClusterDiagramLink,
      linkId
    );

    yield call(callback);
    yield put(removeClusterDiagramLinkSuccess(diagramLink));
  } catch (error) {
    yield put(removeClusterDiagramLinkFailure(error));
    yield put(notify('Something went wrong', { variant: 'error' }));
  }
}

function* linkNodeToService({ payload: { nodeId, serviceId } }) {
  try {
    const diagramNode = yield call(
      DiagramService.updateClusterDiagramNode,
      nodeId,
      { serviceId }
    );

    yield put(linkNodeToServiceSuccess(diagramNode));

    if (diagramNode.service) {
      let SuccessMessage;

      if (diagramNode.service.server)
        SuccessMessage = () => (
          <Typography variant='body2'>
            Linked to service {diagramNode.service.name}.
            <br />
            Metrics will arrive soon.
          </Typography>
        );
      else
        SuccessMessage = () => (
          <Typography variant='body2'>
            Linked to service {diagramNode.service.name}
          </Typography>
        );

      yield put(notify(<SuccessMessage />, { variant: 'success' }));
    }
  } catch (error) {
    yield put(linkNodeToServiceFailure(error));
    yield put(notify('Something went wrong', { variant: 'error' }));
  }
}

function* onFetchClusterDiagramStart() {
  yield takeLatest(
    DiagramActionTypes.FETCH_CLUSTER_DIAGRAM_START,
    fetchClusterDiagram
  );
}

function* onUpdateClusterDiagramElementsStart() {
  yield takeLatest(
    DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_ELEMENTS_START,
    updateClusterDiagramElements
  );
}

function* onRemoveClusterDiagramElementsStart() {
  yield takeLatest(
    DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_ELEMENTS_START,
    removeClusterDiagramElements
  );
}

function* onAddClusterDiagramNodeStart() {
  yield takeLatest(
    DiagramActionTypes.ADD_CLUSTER_DIAGRAM_NODE_START,
    addClusterDiagramNode
  );
}

function* onUpdateClusterDiagramNodeStart() {
  yield takeLatest(
    DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_NODE_START,
    updateClusterDiagramNode
  );
}

function* onRemoveClusterDiagramNodeStart() {
  yield takeLatest(
    DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_NODE_START,
    removeClusterDiagramNode
  );
}

function* onAddClusterDiagramPortStart() {
  yield takeLatest(
    DiagramActionTypes.ADD_CLUSTER_DIAGRAM_PORT_START,
    addClusterDiagramPort
  );
}

function* onUpdateClusterDiagramPortStart() {
  yield takeLatest(
    DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_PORT_START,
    updateClusterDiagramPort
  );
}

function* onRemoveClusterDiagramPortStart() {
  yield takeLatest(
    DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_PORT_START,
    removeClusterDiagramPort
  );
}

function* onAddClusterDiagramLinkStart() {
  yield takeLatest(
    DiagramActionTypes.ADD_CLUSTER_DIAGRAM_LINK_START,
    addClusterDiagramLink
  );
}

function* onUpdateClusterDiagramLinkStart() {
  yield takeLatest(
    DiagramActionTypes.UPDATE_CLUSTER_DIAGRAM_LINK_START,
    updateClusterDiagramLink
  );
}

function* onRemoveClusterDiagramLinkStart() {
  yield takeLatest(
    DiagramActionTypes.REMOVE_CLUSTER_DIAGRAM_LINK_START,
    removeClusterDiagramLink
  );
}

function* onLinkNodeToServiceStart() {
  yield takeLatest(
    DiagramActionTypes.LINK_NODE_TO_SERVICE_START,
    linkNodeToService
  );
}

export default function* diagramSagas() {
  yield all([
    call(onFetchClusterDiagramStart),
    call(onUpdateClusterDiagramElementsStart),
    call(onRemoveClusterDiagramElementsStart),
    call(onAddClusterDiagramNodeStart),
    call(onUpdateClusterDiagramNodeStart),
    call(onRemoveClusterDiagramNodeStart),
    call(onAddClusterDiagramPortStart),
    call(onUpdateClusterDiagramPortStart),
    call(onRemoveClusterDiagramPortStart),
    call(onAddClusterDiagramLinkStart),
    call(onUpdateClusterDiagramLinkStart),
    call(onRemoveClusterDiagramLinkStart),
    call(onLinkNodeToServiceStart)
  ]);
}
