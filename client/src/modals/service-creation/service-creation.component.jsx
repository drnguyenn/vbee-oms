import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';

import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography
} from '@material-ui/core';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';

import { searchClusters } from 'services/cluster.service';
import { searchServers } from 'services/server.service';

import { setServiceCreationModalOpen } from 'redux/modal/modal.actions';
import { createServiceStart } from 'redux/service/service.actions';

import { useAutocompleteLogic } from 'hooks/autocomplete.hooks';

import { DEBOUNCE_SEARCH_WAIT_TIME } from '../../constants';

const handleSearchClusters = debounce(
  async (query = {}, callback = () => {}) => {
    const clusters = await searchClusters(query);

    callback(clusters);
  },
  DEBOUNCE_SEARCH_WAIT_TIME
);

const handleSearchServers = async (query = {}, callback = () => {}) => {
  const servers = await searchServers(query);

  callback(servers);
};

const serverFilterOptions = createFilterOptions({
  stringify: ({ id, name, ipAddress, macAddress }) =>
    `${id}${name}${ipAddress}${macAddress}`,
  trim: true
});

const ServiceCreationModal = () => {
  const { currentCluster } = useSelector(state => state.cluster);

  const { currentServer } = useSelector(state => state.server);

  const [serviceInfo, setServiceInfo] = useState({
    name: '',
    description: '',
    version: '1.0.0'
  });
  const { name, description, version } = serviceInfo;

  const {
    options: clusterOptions,
    value: clusterValue,
    inputValue: clusterInputValue,
    isSearching: isSearchingCluster,
    handleValueChange: handleClusterValueChange,
    handleInputChange: handleClusterInputChange,
    setOptions: setClusterOptions,
    setValue: setClusterValue
  } = useAutocompleteLogic(handleSearchClusters, 'q', 'name', 'id');

  const [serverOptions, setServerOptions] = useState([]);
  const [serverValue, setServerValue] = useState(null);
  const [serverInputValue, setServerInputValue] = useState('');
  const [isFetchingServer, setIsFetchingServer] = useState(false);

  const { openServiceCreationModal } = useSelector(state => state.modal);

  const { isProcessing } = useSelector(state => state.service);

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentCluster) setClusterValue(currentCluster);
    else if (currentServer) {
      setServerOptions([currentServer]);
      setServerValue(currentServer);

      setClusterOptions([currentServer.cluster]);
      setClusterValue(currentServer.cluster);
    }
  }, [currentCluster, currentServer, setClusterOptions, setClusterValue]);

  useEffect(() => {
    if (clusterValue) {
      setIsFetchingServer(true);

      handleSearchServers({ cluster: clusterValue.id }, results => {
        if (serverValue && !results.some(({ id }) => id === serverValue.id))
          setServerValue(null);

        setServerOptions(results);

        setIsFetchingServer(false);
      });
    }
  }, [clusterValue, serverValue]);

  const handleClose = () => dispatch(setServiceCreationModalOpen(false));

  const handleChange = event => {
    const { name: elementName, value } = event.target;
    setServiceInfo({ ...serviceInfo, [elementName]: value });
  };

  const handleServerValueChange = (event, newValue) => {
    setServerValue(newValue);
  };

  const handleServerInputChange = (event, newInputValue) => {
    setServerInputValue(newInputValue);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (clusterValue)
      dispatch(
        createServiceStart({
          ...serviceInfo,
          clusterId: clusterValue.id,
          serverId: serverValue ? serverValue.id : null
        })
      );
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

          {clusterValue && (
            <Autocomplete
              fullWidth
              value={serverValue}
              inputValue={serverInputValue}
              onChange={handleServerValueChange}
              onInputChange={handleServerInputChange}
              filterOptions={serverFilterOptions}
              includeInputInList
              getOptionSelected={(option, selectedValue) =>
                option.id === selectedValue.id
              }
              getOptionLabel={option => option.name}
              options={serverOptions}
              noOptionsText='No matching results found'
              loading={isFetchingServer && !serverOptions.length}
              loadingText='Fetching...'
              renderInput={params => (
                <TextField
                  {...params}
                  label='Choose a server'
                  placeholder="Enter server's ID, name, IP address, or MAC address, etc."
                  margin='normal'
                  variant='outlined'
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isFetchingServer ? (
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
                    {option.ipAddress}
                  </Typography>
                </div>
              )}
            />
          )}
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
