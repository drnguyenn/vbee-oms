import { useDispatch, useSelector } from 'react-redux';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from '@material-ui/core';

import { setRepositoryMemberRemovalConfirmationModalOpen } from 'redux/modal/modal.actions';
import { removeRepositoryMemberStart } from 'redux/repository/repository.actions';

const RepositoryMemberRemovalConfirmationModal = () => {
  const { openRepositoryMemberRemovalConfirmationModal } = useSelector(
    state => state.modal
  );

  const { currentRepository, currentMember, isRemovingMembers } = useSelector(
    state => state.repository
  );

  const dispatch = useDispatch();

  const handleClose = () =>
    dispatch(setRepositoryMemberRemovalConfirmationModalOpen(false));

  const handleSubmit = async event => {
    event.preventDefault();

    if (currentRepository.id && currentMember.id)
      dispatch(
        removeRepositoryMemberStart(currentRepository.id, currentMember.id)
      );
  };

  if (currentRepository && currentMember)
    return (
      <Dialog
        open={openRepositoryMemberRemovalConfirmationModal}
        onClose={handleClose}
      >
        <DialogTitle>Remove member from repository</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Once removed, <b>{currentMember.githubUsername}</b> will no longer
            have access to the <b>{currentRepository.name}</b>.
            <br />
            Are you sure ?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            variant='outlined'
            disabled={isRemovingMembers}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant='contained'
            color='secondary'
            disabled={isRemovingMembers}
          >
            Remove member
          </Button>
        </DialogActions>
      </Dialog>
    );

  return null;
};

export default RepositoryMemberRemovalConfirmationModal;
