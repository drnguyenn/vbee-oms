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
import { searchRepositories } from 'services/repository.service';

import { setServiceCreationModalOpen } from 'redux/modal/modal.actions';
import { createServiceStart } from 'redux/service/service.actions';

import { useAutocompleteLogic } from 'hooks/autocomplete.hooks';

import { DEBOUNCE_SEARCH_WAIT_TIME } from 'constants/index';

const handleSearchClusters = debounce(
  async (query = {}, callback = () => {}) => {
    const clusters = await searchClusters(query);

    callback(clusters);
  },
  DEBOUNCE_SEARCH_WAIT_TIME
);

const handleSearchRepositories = debounce(
  async (query = {}, callback = () => {}) => {
    const repositories = await searchRepositories(query);

    callback(repositories);
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

  const { currentRepository } = useSelector(state => state.repository);

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
    setValue: setClusterValue
  } = useAutocompleteLogic(handleSearchClusters, 'q', 'name', 'id');

  const {
    options: repoOptions,
    value: repoValue,
    inputValue: repoInputValue,
    isSearching: isSearchingRepo,
    handleValueChange: handleRepoValueChange,
    handleInputChange: handleRepoInputChange,
    setValue: setRepoValue
  } = useAutocompleteLogic(handleSearchRepositories, 'q', 'name', 'id');

  const [serverOptions, setServerOptions] = useState([]);
  const [serverValue, setServerValue] = useState(null);
  const [serverInputValue, setServerInputValue] = useState('');
  const [isFetchingServer, setIsFetchingServer] = useState(false);

  const { openServiceCreationModal } = useSelector(state => state.modal);

  const { isProcessing } = useSelector(state => state.service);

  const dispatch = useDispatch();

  const fetchServers = clusterId => {
    setIsFetchingServer(true);

    handleSearchServers({ cluster: clusterId }, results => {
      setServerOptions(results);

      setIsFetchingServer(false);
    });
  };

  // First render
  useEffect(() => {
    if (currentCluster) {
      fetchServers(currentCluster.id);

      setClusterValue(currentCluster);
    } else if (currentServer) {
      const { cluster } = currentServer;
      fetchServers(cluster.id);

      setClusterValue(cluster);

      setServerOptions([currentServer]);
      setServerValue(currentServer);
    } else if (currentRepository) {
      setRepoValue(currentRepository);
    }
  }, [
    currentCluster,
    currentRepository,
    currentServer,
    setClusterValue,
    setRepoValue
  ]);

  const customHandleClusterValueChange = (event, newValue) => {
    handleClusterValueChange(event, newValue);

    if (newValue) {
      setServerValue(null);

      fetchServers(newValue.id);
    }
  };

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
          serverId: serverValue ? serverValue.id : null,
          repositoryId: repoValue ? repoValue.id : null
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
            onChange={customHandleClusterValueChange}
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
                placeholder="Search by cluster's name, description, or ID"
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
                  placeholder="Search by server's name, IP address, MAC address, or ID."
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

          <Autocomplete
            fullWidth
            value={repoValue}
            inputValue={repoInputValue}
            onChange={handleRepoValueChange}
            onInputChange={handleRepoInputChange}
            filterOptions={option => option}
            includeInputInList
            getOptionSelected={(option, selectedValue) =>
              option.id === selectedValue.id
            }
            getOptionLabel={option => option.name}
            options={repoOptions}
            noOptionsText='No matching results found'
            loading={isSearchingRepo && !repoOptions.length}
            loadingText='Searching...'
            renderInput={params => (
              <TextField
                {...params}
                label='Choose a repository'
                placeholder="Search by repository's name, owner, URL, ID, or GitHub ID"
                margin='normal'
                variant='outlined'
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isSearchingRepo ? (
                        <CircularProgress color='inherit' size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
            renderOption={({ name: repoName, url, owner }) => (
              <div>
                <Typography>
                  <a href={url} target='_blank' rel='noopener noreferrer'>
                    {repoName}
                  </a>
                </Typography>
                <Typography color='textSecondary' variant='body2'>
                  of{' '}
                  <a
                    href={`https://github.com/${owner}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <b>{owner}</b>
                  </a>
                </Typography>
              </div>
            )}
          />

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
