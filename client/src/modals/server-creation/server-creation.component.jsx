import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce, uniq } from 'lodash';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  CircularProgress
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import { searchClusters } from 'services/cluster.service';

import { setServerCreationModalOpen } from 'redux/modal/modal.actions';
import { createServerStart } from 'redux/server/server.actions';

import InputGroup, {
  useInputGroup
} from 'components/input-group/input-group.component';
import { useAutocompleteLogic } from 'hooks/autocomplete.hooks';

import { DEBOUNCE_SEARCH_WAIT_TIME } from '../../constants';

const handleSearchClusters = debounce(
  async (query = {}, callback = () => {}) => {
    const clusters = await searchClusters(query);

    callback(clusters);
  },
  DEBOUNCE_SEARCH_WAIT_TIME
);

const ServerCreationModal = () => {
  const [serverInfo, setServerInfo] = useState({
    name: '',
    ipAddress: '',
    macAddress: ''
  });
  const { name, ipAddress, macAddress } = serverInfo;

  const [domains, handlers] = useInputGroup();

  const {
    options: clusterOptions,
    value: clusterValue,
    inputValue: clusterInputValue,
    isSearching: isSearchingCluster,
    handleValueChange: handleClusterValueChange,
    handleInputChange: handleClusterInputChange,
    setValue: setClusterValue
  } = useAutocompleteLogic(handleSearchClusters, 'q', 'name', 'id');

  const { openServerCreationModal } = useSelector(state => state.modal);

  const { isProcessing } = useSelector(state => state.server);

  const { currentCluster } = useSelector(state => state.cluster);

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentCluster) setClusterValue(currentCluster);
  }, [currentCluster, setClusterValue]);

  const handleClose = () => dispatch(setServerCreationModalOpen(false));

  const handleChange = event => {
    const { name: elementName, value: elementValue } = event.target;
    setServerInfo({ ...serverInfo, [elementName]: elementValue });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (clusterValue)
      dispatch(
        createServerStart({
          ...serverInfo,
          clusterId: clusterValue.id,
          domains: uniq(Object.values(domains).filter(domain => domain.length))
        })
      );
  };

  return (
    <Dialog open={openServerCreationModal} onClose={handleClose}>
      <DialogTitle>Create new server</DialogTitle>
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
            label='Server name'
            margin='normal'
            variant='outlined'
            fullWidth
          />
          <Autocomplete
            fullWidth
            value={clusterValue}
            inputValue={clusterInputValue}
            onChange={handleClusterValueChange}
            onInputChange={handleClusterInputChange}
            filterOptions={option => option}
            includeInputInList
            getOptionSelected={(option, selectedValue) =>
              option.id === selectedValue.id
            }
            getOptionLabel={option => option.name}
            options={clusterOptions}
            noOptionsText='No matching results found'
            loading={isSearchingCluster && !clusterOptions.length}
            loadingText='Searching...'
            renderInput={params => (
              <TextField
                {...params}
                required
                label='Choose a cluster'
                placeholder="Enter cluster's ID, name, or description"
                margin='normal'
                variant='outlined'
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isSearchingCluster ? (
                        <CircularProgress color='inherit' size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
            renderOption={option => (
              <div>
                <Typography>{option.name}</Typography>
                <Typography color='textSecondary' variant='body2'>
                  {!option.description && <em>No description provided</em>}
                  {option.description.length <= 70
                    ? option.description
                    : `${option.description.substring(0, 70)}...`}
                </Typography>
              </div>
            )}
          />
          <TextField
            required
            autoComplete='off'
            name='ipAddress'
            type='text'
            value={ipAddress}
            onChange={handleChange}
            disabled={isProcessing}
            label='IP address'
            placeholder='12.244.233.165'
            margin='normal'
            variant='outlined'
            fullWidth
          />
          <TextField
            required
            autoComplete='off'
            name='macAddress'
            type='text'
            value={macAddress}
            onChange={handleChange}
            disabled={isProcessing}
            label='MAC address'
            placeholder='90:2B:34:9E:0E:C0'
            margin='normal'
            variant='outlined'
            fullWidth
          />
          <InputGroup
            inputs={domains}
            inputLabel='Domain'
            placeholder='www.some-domain.com'
            disabled={isProcessing}
            addButtonTitle='Add more domain'
            removeButtonTitle='Remove domain'
            {...handlers}
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

export default ServerCreationModal;
