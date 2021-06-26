import { useDispatch, useSelector } from 'react-redux';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from '@material-ui/core';

import { setServerDomainRemoveConfirmationModalOpen } from '../../redux/modal/modal.actions';
import { removeServerDomainStart } from '../../redux/server/server.actions';

const ServerDomainRemoveConfirmationModal = () => {
  const { openServerDomainRemoveConfirmationModal } = useSelector(
    state => state.modal
  );

  const { currentDomain, isRemovingDomains } = useSelector(
    state => state.server
  );

  const dispatch = useDispatch();

  const handleClose = () =>
    dispatch(setServerDomainRemoveConfirmationModalOpen(false));

  const handleSubmit = async event => {
    event.preventDefault();

    if (currentDomain.id) dispatch(removeServerDomainStart(currentDomain.id));
  };

  if (currentDomain)
    return (
      <Dialog
        open={openServerDomainRemoveConfirmationModal}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>Remove domain</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Remove domain <b>{currentDomain.value}</b> ?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            variant='outlined'
            disabled={isRemovingDomains}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant='contained'
            color='secondary'
            disabled={isRemovingDomains}
          >
            Remove domain
          </Button>
        </DialogActions>
      </Dialog>
    );

  return null;
};

export default ServerDomainRemoveConfirmationModal;
