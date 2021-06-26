import { useDispatch, useSelector } from 'react-redux';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from '@material-ui/core';

import { setDiagramNodeRemoveConfirmationModalOpen } from '../../redux/modal/modal.actions';
import { removeClusterDiagramNodeStart } from '../../redux/diagram/diagram.actions';

import { removeElementsChanges } from '../../utils/diagram.utils';

const DiagramNodeRemoveConfirmationModal = () => {
  const { openClusterDiagramNodeRemoveConfirmationModal } = useSelector(
    state => state.modal
  );

  const { currentDiagram, selectedNode, isSynchronizing } = useSelector(
    state => state.diagram
  );

  const dispatch = useDispatch();

  const handleClose = () =>
    dispatch(setDiagramNodeRemoveConfirmationModalOpen(false));

  const handleSubmit = async event => {
    event.preventDefault();

    if (selectedNode.id)
      dispatch(
        removeClusterDiagramNodeStart(selectedNode.id, selectedNode.callback)
      );

    removeElementsChanges([`nodes.${selectedNode.id}`]);

    handleClose();
  };

  if (currentDiagram && selectedNode)
    return (
      <Dialog
        open={openClusterDiagramNodeRemoveConfirmationModal}
        onClose={handleClose}
      >
        <DialogTitle>Remove node</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Remove <b>{selectedNode.name}</b> node from{' '}
            <b>{currentDiagram.cluster.name} Architecture</b> diagram ?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            variant='outlined'
            disabled={isSynchronizing}
          >
            Cancel
          </Button>
          <Button
            autoFocus
            onClick={handleSubmit}
            variant='contained'
            color='secondary'
            disabled={isSynchronizing}
          >
            Remove node
          </Button>
        </DialogActions>
      </Dialog>
    );

  return null;
};

export default DiagramNodeRemoveConfirmationModal;
