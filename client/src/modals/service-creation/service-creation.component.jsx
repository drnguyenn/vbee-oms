import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@material-ui/core';

import { toggleServiceCreationModal } from '../../redux/modal/modal.actions';
import { createServiceStart } from '../../redux/service/service.actions';
import { fetchAllClustersStart } from '../../redux/cluster/cluster.actions';

const ServiceCreationModal = () => {
  const { currentCluster } = useSelector(state => state.cluster);

  const [serviceInfo, setServiceInfo] = useState({
    name: '',
    description: '',
    clusterId: '',
    version: '1.0.0'
  });

  const { name, description, clusterId, version } = serviceInfo;

  const { openServiceCreationModal } = useSelector(state => state.modal);

  const { isProcessing } = useSelector(state => state.service);

  const { clusters } = useSelector(state => state.cluster);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!clusters.length) dispatch(fetchAllClustersStart());
    else if (currentCluster)
      setServiceInfo(prevServiceInfo => ({
        ...prevServiceInfo,
        clusterId: currentCluster.id
      }));
  }, [clusters.length, currentCluster, dispatch]);

  const handleClose = () => dispatch(toggleServiceCreationModal());

  const handleChange = event => {
    const { name: elementName, value } = event.target;
    setServiceInfo({ ...serviceInfo, [elementName]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    dispatch(createServiceStart(serviceInfo));
  };

  return (
    <Dialog open={openServiceCreationModal} onClose={handleClose}>
      <DialogTitle>Create new service</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            required
            autoComplete='off'
            autoFocus
            name='name'
            type='text'
            value={name}
            onChange={handleChange}
            disabled={isProcessing}
            label='Service name'
            placeholder='Chatbot Service, etc.'
            margin='normal'
            variant='outlined'
            fullWidth
          />
          <FormControl required variant='outlined' margin='normal' fullWidth>
            <InputLabel>Cluster</InputLabel>
            <Select
              name='clusterId'
              value={clusterId}
              onChange={handleChange}
              label='Cluster'
            >
              {clusters.map(({ id, name: clusterName }) => (
                <MenuItem key={id} value={id} label={clusterName}>
                  {clusterName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoComplete='off'
            name='description'
            type='text'
            value={description}
            onChange={handleChange}
            disabled={isProcessing}
            label='Description'
            placeholder='Some text to describe the service purpose, components,...'
            margin='normal'
            variant='outlined'
            multiline
            rows={4}
            fullWidth
          />
          <TextField
            autoComplete='off'
            name='version'
            type='text'
            value={version}
            onChange={handleChange}
            disabled={isProcessing}
            label='Version'
            placeholder='1.0.0'
            margin='normal'
            variant='outlined'
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

export default ServiceCreationModal;
