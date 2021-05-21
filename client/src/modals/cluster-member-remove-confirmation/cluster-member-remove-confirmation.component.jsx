import { useDispatch, useSelector } from 'react-redux';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from '@material-ui/core';

import { toggleClusterMemberRemoveConfirmationModal } from '../../redux/modal/modal.actions';
import { removeClusterMemberStart } from '../../redux/cluster/cluster.actions';

const ClusterMemberRemoveConfirmationModal = () => {
  const { openClusterMemberRemoveConfirmationModal } = useSelector(
    state => state.modal
  );

  const { currentCluster, currentMember, isRemovingMembers } = useSelector(
    state => state.cluster
  );

  const dispatch = useDispatch();

  const handleClose = () =>
    dispatch(toggleClusterMemberRemoveConfirmationModal());

  const handleSubmit = async event => {
    event.preventDefault();

    if (currentCluster.id && currentMember.id)
      dispatch(removeClusterMemberStart(currentCluster.id, currentMember.id));
  };

  if (currentCluster && currentMember)
    return (
      <Dialog
        open={openClusterMemberRemoveConfirmationModal}
        onClose={handleClose}
      >
        <DialogTitle>Remove member from cluster</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Once removed, <b>{currentMember.username}</b> will no longer have
            access to the <b>{currentCluster.name}</b> and{' '}
            <b>all services inside</b>.
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

export default ClusterMemberRemoveConfirmationModal;
