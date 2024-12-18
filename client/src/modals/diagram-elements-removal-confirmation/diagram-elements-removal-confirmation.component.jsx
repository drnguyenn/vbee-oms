import { useDispatch, useSelector } from 'react-redux';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@material-ui/core';

import { setDiagramElementsRemovalConfirmationModalOpen } from '../../redux/modal/modal.actions';
import { removeClusterDiagramElementsStart } from '../../redux/diagram/diagram.actions';

import { removeElementsChanges } from '../../utils/diagram.utils';

const DiagramElementsRemovalConfirmationModal = () => {
  const { openClusterDiagramElementsRemovalConfirmationModal } = useSelector(
    state => state.modal
  );

  const { currentDiagram, selectedElements, isSynchronizing } = useSelector(
    state => state.diagram
  );
  const { nodes, ports, links, callback } = selectedElements;

  const dispatch = useDispatch();

  const handleClose = () =>
    dispatch(setDiagramElementsRemovalConfirmationModalOpen(false));

  const handleSubmit = async event => {
    event.preventDefault();

    if (selectedElements)
      dispatch(removeClusterDiagramElementsStart({ nodes, ports, links }));

    removeElementsChanges([
      ...nodes.map(nodeId => `nodes.${nodeId}`),
      ...ports.map(portId => `ports.${portId}`),
      ...links.map(linkId => `links.${linkId}`)
    ]);
    callback();

    handleClose();
  };

  if (currentDiagram)
    return (
      <Dialog
        open={openClusterDiagramElementsRemovalConfirmationModal}
        onClose={handleClose}
      >
        <DialogTitle>Remove items</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Remove <b>{nodes.length} nodes</b> and other items from{' '}
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
            Remove items
          </Button>
        </DialogActions>
      </Dialog>
    );

  return null;
};

export default DiagramElementsRemovalConfirmationModal;
