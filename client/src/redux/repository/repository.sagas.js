import { takeLatest, all, call, put } from 'redux-saga/effects';

import {
  fetchAllRepositoriesSuccess,
  fetchAllRepositoriesFailure,
  fetchRepositorySuccess,
  fetchRepositoryFailure,
  fetchRepositoryMembersSuccess,
  fetchRepositoryMembersFailure,
  addRepositoryMemberSuccess,
  addRepositoryMemberFailure,
  removeRepositoryMemberSuccess,
  removeRepositoryMemberFailure,
  updateRepositoryInvitationSuccess,
  updateRepositoryInvitationFailure
} from 'redux/repository/repository.actions';
import { notify } from 'redux/notification/notification.actions';
import {
  setRepositoryMemberAdditionModalOpen,
  setRepositoryMemberRemovalConfirmationModalOpen
} from 'redux/modal/modal.actions';

import * as RepositoryService from 'services/repository.service';

import RepositoryActionTypes from './repository.types';

function* fetchAllRepositories() {
  try {
    const repositorys = yield call(RepositoryService.fetchAllRepositories);

    yield put(fetchAllRepositoriesSuccess(repositorys));
  } catch (error) {
    yield put(fetchAllRepositoriesFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* fetchRepository({ payload }) {
  try {
    const repository = yield call(RepositoryService.fetchRepository, payload);

    yield put(fetchRepositorySuccess(repository));
  } catch (error) {
    yield put(fetchRepositoryFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* fetchMembers({ payload }) {
  try {
    const result = yield call(RepositoryService.fetchMembers, payload);

    yield put(fetchRepositoryMembersSuccess(result));
  } catch (error) {
    yield put(fetchRepositoryMembersFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* addMember({ payload: { repositoryId, userId, data } }) {
  try {
    yield put(setRepositoryMemberAdditionModalOpen(false));

    const member = yield call(
      RepositoryService.addMember,
      repositoryId,
      userId,
      data
    );

    yield put(addRepositoryMemberSuccess(member));
    yield put(
      notify(`Member "${member.user.githubUsername}" added`, {
        variant: 'success'
      })
    );
  } catch (error) {
    yield put(addRepositoryMemberFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* addMemberFromGitHub({
  payload: { repositoryId, githubUsername, data }
}) {
  try {
    yield put(setRepositoryMemberAdditionModalOpen(false));

    const member = yield call(
      RepositoryService.addMemberFromGitHub,
      repositoryId,
      githubUsername,
      data
    );

    yield put(addRepositoryMemberSuccess(member));
    yield put(
      notify(`Member "${member.user.githubUsername}" added`, {
        variant: 'success'
      })
    );
  } catch (error) {
    yield put(addRepositoryMemberFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* removeMember({ payload: { repositoryId, userId } }) {
  try {
    yield put(setRepositoryMemberRemovalConfirmationModalOpen(false));

    const member = yield call(
      RepositoryService.removeMember,
      repositoryId,
      userId
    );

    yield put(removeRepositoryMemberSuccess(member));
    yield put(notify('Member removed', { variant: 'success' }));
  } catch (error) {
    yield put(removeRepositoryMemberFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* updateInvitation({ payload: { repositoryId, userId, data } }) {
  try {
    const member = yield call(
      RepositoryService.updateInvitation,
      repositoryId,
      userId,
      data
    );

    yield put(updateRepositoryInvitationSuccess(member));
    yield put(
      notify(`Invitation of "${member.user.username}" updated`, {
        variant: 'success'
      })
    );
  } catch (error) {
    yield put(updateRepositoryInvitationFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* onFetchAllRepositoriesStart() {
  yield takeLatest(
    RepositoryActionTypes.FETCH_ALL_REPOSITORIES_START,
    fetchAllRepositories
  );
}

function* onFetchRepositoryStart() {
  yield takeLatest(
    RepositoryActionTypes.FETCH_REPOSITORY_START,
    fetchRepository
  );
}

function* onFetchMembersStart() {
  yield takeLatest(
    RepositoryActionTypes.FETCH_REPOSITORY_MEMBERS_START,
    fetchMembers
  );
}

function* onAddMemberStart() {
  yield takeLatest(
    RepositoryActionTypes.ADD_REPOSITORY_MEMBER_START,
    addMember
  );
}

function* onAddMemberFromGitHubStart() {
  yield takeLatest(
    RepositoryActionTypes.ADD_REPOSITORY_MEMBER_FROM_GITHUB_START,
    addMemberFromGitHub
  );
}

function* onRemoveMemberStart() {
  yield takeLatest(
    RepositoryActionTypes.REMOVE_REPOSITORY_MEMBER_START,
    removeMember
  );
}

function* onUpdateInvitationStart() {
  yield takeLatest(
    RepositoryActionTypes.UPDATE_REPOSITORY_INVITATION_START,
    updateInvitation
  );
}

export default function* repositorySagas() {
  yield all([
    call(onFetchAllRepositoriesStart),
    call(onFetchRepositoryStart),
    call(onFetchMembersStart),
    call(onAddMemberStart),
    call(onAddMemberFromGitHubStart),
    call(onRemoveMemberStart),
    call(onUpdateInvitationStart)
  ]);
}
