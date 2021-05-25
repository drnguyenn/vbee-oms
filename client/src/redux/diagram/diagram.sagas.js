import { takeLatest, all, call, put } from 'redux-saga/effects';

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
  removeClusterDiagramLinkFailure
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
    yield put(notify({ type: 'error', content: 'Something went wrong' }));
  }
}

function* updateClusterDiagramElements({ payload: { diagramId, elements } }) {
  try {
    yield call(
      DiagramService.updateClusterDiagramElements,
      diagramId,
      elements
    );

    yield put(updateClusterDiagramElementsSuccess());
  } catch (error) {
    yield put(updateClusterDiagramElementsFailure(error));
    yield put(notify({ type: 'error', content: 'Something went wrong' }));
  }
}

function* removeClusterDiagramElements({
  payload: { diagramId, elements, callback }
}) {
  try {
    yield call(
      DiagramService.removeClusterDiagramElements,
      diagramId,
      elements
    );

    yield call(callback);
    yield put(removeClusterDiagramElementsSuccess());
  } catch (error) {
    yield put(removeClusterDiagramElementsFailure(error));
    yield put(notify({ type: 'error', content: 'Something went wrong' }));
  }
}

function* addClusterDiagramNode({ payload: { diagramId, node } }) {
  try {
    const diagramNode = yield call(
      DiagramService.addClusterDiagramNode,
      diagramId,
      node
    );

    yield put(addClusterDiagramNodeSuccess(diagramNode));
  } catch (error) {
    yield put(addClusterDiagramNodeFailure(error));
    yield put(notify({ type: 'error', content: 'Something went wrong' }));
  }
}

function* updateClusterDiagramNode({ payload: { diagramId, nodeId, data } }) {
  try {
    const diagramNode = yield call(
      DiagramService.updateClusterDiagramNode,
      diagramId,
      nodeId,
      data
    );

    yield put(updateClusterDiagramNodeSuccess(diagramNode));
  } catch (error) {
    yield put(updateClusterDiagramNodeFailure(error));
    yield put(notify({ type: 'error', content: 'Something went wrong' }));
  }
}

function* removeClusterDiagramNode({
  payload: { diagramId, nodeId, callback }
}) {
  try {
    const diagramNode = yield call(
      DiagramService.removeClusterDiagramNode,
      diagramId,
      nodeId
    );

    yield call(callback);
    yield put(removeClusterDiagramNodeSuccess(diagramNode));
  } catch (error) {
    yield put(removeClusterDiagramNodeFailure(error));
    yield put(notify({ type: 'error', content: 'Something went wrong' }));
  }
}

function* addClusterDiagramPort({ payload: { diagramId, port } }) {
  try {
    const diagramPort = yield call(
      DiagramService.addClusterDiagramPort,
      diagramId,
      port
    );

    yield put(addClusterDiagramPortSuccess(diagramPort));
  } catch (error) {
    yield put(addClusterDiagramPortFailure(error));
    yield put(notify({ type: 'error', content: 'Something went wrong' }));
  }
}

function* updateClusterDiagramPort({ payload: { diagramId, portId, data } }) {
  try {
    const diagramPort = yield call(
      DiagramService.updateClusterDiagramPort,
      diagramId,
      portId,
      data
    );

    yield put(updateClusterDiagramPortSuccess(diagramPort));
  } catch (error) {
    yield put(updateClusterDiagramPortFailure(error));
    yield put(notify({ type: 'error', content: 'Something went wrong' }));
  }
}

function* removeClusterDiagramPort({
  payload: { diagramId, portId, callback }
}) {
  try {
    const diagramPort = yield call(
      DiagramService.removeClusterDiagramPort,
      diagramId,
      portId
    );

    yield call(callback);
    yield put(removeClusterDiagramPortSuccess(diagramPort));
  } catch (error) {
    yield put(removeClusterDiagramPortFailure(error));
    yield put(notify({ type: 'error', content: 'Something went wrong' }));
  }
}

function* addClusterDiagramLink({ payload: { diagramId, link, callback } }) {
  try {
    const diagramLink = yield call(
      DiagramService.addClusterDiagramLink,
      diagramId,
      link
    );

    yield call(callback);
    yield put(addClusterDiagramLinkSuccess(diagramLink));
  } catch (error) {
    yield put(addClusterDiagramLinkFailure(error));
    yield put(notify({ type: 'error', content: 'Something went wrong' }));
  }
}

function* updateClusterDiagramLink({ payload: { diagramId, linkId, data } }) {
  try {
    const diagramLink = yield call(
      DiagramService.updateClusterDiagramLink,
      diagramId,
      linkId,
      data
    );

    yield put(updateClusterDiagramLinkSuccess(diagramLink));
  } catch (error) {
    yield put(updateClusterDiagramLinkFailure(error));
    yield put(notify({ type: 'error', content: 'Something went wrong' }));
  }
}

function* removeClusterDiagramLink({
  payload: { diagramId, linkId, callback }
}) {
  try {
    const diagramLink = yield call(
      DiagramService.removeClusterDiagramLink,
      diagramId,
      linkId
    );

    yield call(callback);
    yield put(removeClusterDiagramLinkSuccess(diagramLink));
  } catch (error) {
    yield put(removeClusterDiagramLinkFailure(error));
    yield put(notify({ type: 'error', content: 'Something went wrong' }));
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
    call(onRemoveClusterDiagramLinkStart)
  ]);
}
