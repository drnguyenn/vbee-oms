import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@material-ui/core';

import { toggleClusterCreationModal } from '../../redux/modal/modal.actions';
import { createClusterStart } from '../../redux/cluster/cluster.actions';

const ClusterCreationModal = () => {
  const [clusterInfo, setClusterInfo] = useState({
    name: '',
    description: ''
  });

  const { name, description } = clusterInfo;

  const { openClusterCreationModal } = useSelector(state => state.modal);
  const { isProcessing } = useSelector(state => state.cluster);

  const dispatch = useDispatch();

  const handleClose = () => dispatch(toggleClusterCreationModal());

  const handleChange = event => {
    const { name: elementName, value } = event.target;
    setClusterInfo({ ...clusterInfo, [elementName]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    dispatch(createClusterStart(clusterInfo));
  };

  return (
    <Dialog open={openClusterCreationModal} onClose={handleClose}>
      <DialogTitle>Create new cluster</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            required
            autoComplete='off'
            name='name'
            type='text'
            value={name}
            onChange={handleChange}
            disabled={isProcessing}
            label='Cluster name'
            margin='normal'
            variant='outlined'
            fullWidth
          />
          <TextField
            autoComplete='off'
            name='description'
            type='text'
            value={description}
            onChange={handleChange}
            disabled={isProcessing}
            label='Description'
            margin='normal'
            variant='outlined'
            multiline
            rows={4}
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            variant='outlined'
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={isProcessing}
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ClusterCreationModal;
