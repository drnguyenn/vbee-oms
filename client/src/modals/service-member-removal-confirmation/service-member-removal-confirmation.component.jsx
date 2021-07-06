import { useDispatch, useSelector } from 'react-redux';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from '@material-ui/core';

import { setServiceMemberRemovalConfirmationModalOpen } from '../../redux/modal/modal.actions';
import { removeServiceMemberStart } from '../../redux/service/service.actions';

const ServiceMemberRemovalConfirmationModal = () => {
  const { openServiceMemberRemovalConfirmationModal } = useSelector(
    state => state.modal
  );

  const { currentService, currentMember, isRemovingMembers } = useSelector(
    state => state.service
  );

  const dispatch = useDispatch();

  const handleClose = () =>
    dispatch(setServiceMemberRemovalConfirmationModalOpen(false));

  const handleSubmit = async event => {
    event.preventDefault();

    if (currentService.id && currentMember.id)
      dispatch(removeServiceMemberStart(currentService.id, currentMember.id));
  };

  if (currentService && currentMember)
    return (
      <Dialog
        open={openServiceMemberRemovalConfirmationModal}
        onClose={handleClose}
      >
        <DialogTitle>Remove member from service</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Once removed, <b>{currentMember.username}</b> will no longer have
            access to the <b>{currentService.name}</b>.
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

export default ServiceMemberRemovalConfirmationModal;
