import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';

import {
  Divider,
  IconButton,
  Tooltip,
  TextField,
  Fade,
  CircularProgress,
  makeStyles,
  Typography
} from '@material-ui/core';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { Close, Check, Edit } from '@material-ui/icons';

import { searchServers } from 'services/server.service';
import { searchRepositories } from 'services/repository.service';

import { updateServiceStart } from 'redux/service/service.actions';

import { useAutocompleteLogic } from 'hooks/autocomplete.hooks';

import Section from 'components/section/section.component';

import ROUTE_PATHS from 'router/route-paths';

import {
  SectionRowStyles,
  SectionRowTitleStyles,
  SectionRowValueStyles
} from 'components/section/section.styles';

import { DEBOUNCE_SEARCH_WAIT_TIME } from 'constants/index';

const useStyles = makeStyles({
  textField: {
    width: '70%'
  }
});

const handleSearchServers = async (query = {}, callback = () => {}) => {
  const servers = await searchServers(query);

  callback(servers);
};

const handleSearchRepositories = debounce(
  async (query = {}, callback = () => {}) => {
    const repositories = await searchRepositories(query);

    callback(repositories);
  },
  DEBOUNCE_SEARCH_WAIT_TIME
);

const serverFilterOptions = createFilterOptions({
  stringify: ({ id, name, ipAddress, macAddress }) =>
    `${id}${name}${ipAddress}${macAddress}`,
  trim: true
});

const ServiceBasicInfoSection = () => {
  const classes = useStyles();

  const { currentService, isUpdatingInfo } = useSelector(
    state => state.service
  );

  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);

  const [serviceInfo, setServiceInfo] = useState({
    name: '',
    description: '',
    version: ''
  });
  const { name, description, version } = serviceInfo;

  const [serverOptions, setServerOptions] = useState([]);
  const [serverValue, setServerValue] = useState(null);
  const [serverInputValue, setServerInputValue] = useState('');
  const [isFetchingServer, setIsFetchingServer] = useState(false);

  const {
    options: repoOptions,
    value: repoValue,
    inputValue: repoInputValue,
    isSearching: isSearchingRepo,
    handleValueChange: handleRepoValueChange,
    handleInputChange: handleRepoInputChange
  } = useAutocompleteLogic(handleSearchRepositories, 'q', 'name', 'id');

  useEffect(() => {
    if (currentService && !isUpdatingInfo)
      setServiceInfo({
        name: currentService.name || '',
        description: currentService.description || '',
        version: currentService.version || ''
      });
  }, [currentService, isUpdatingInfo]);

  useEffect(() => {
    if (currentService.server) {
      setServerOptions([currentService.server]);
      setServerValue(currentService.server);
    }
  }, [currentService.server]);

  useEffect(() => {
    // In case of `serverOptions` is empty or only contain the
    // initital selected server
    if (editMode && serverOptions.length < 2) {
      setIsFetchingServer(true);

      handleSearchServers({ cluster: currentService.cluster.id }, results => {
        setServerOptions(results);

        setIsFetchingServer(false);
      });
    }
  }, [currentService.cluster.id, editMode, serverOptions.length, serverValue]);

  const handleEditClick = () => setEditMode(true);

  const handleCancelClick = () => {
    setServiceInfo({
      name: currentService.name || '',
      description: currentService.description || '',
      version: currentService.version || ''
    });
    setEditMode(false);
  };

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

    dispatch(
      updateServiceStart(currentService.id, {
        ...serviceInfo,
        serverId: serverValue ? serverValue.id : null,
        repositoryId: repoValue ? repoValue.id : null
      })
    );

    setEditMode(false);
  };

  const HeaderOptions = () => {
    if (editMode)
      return (
        <div>
          <Tooltip title='Cancel' arrow>
            <IconButton onClick={handleCancelClick}>
              <Close />
            </IconButton>
          </Tooltip>
          {name.length ? (
            <Tooltip title='Save' arrow>
              <IconButton onClick={handleSubmit}>
                <Check />
              </IconButton>
            </Tooltip>
          ) : (
            <IconButton disabled>
              <Check />
            </IconButton>
          )}
        </div>
      );

    return isUpdatingInfo ? (
      <CircularProgress size={25} />
    ) : (
      <Tooltip title='Edit' arrow>
        <IconButton onClick={handleEditClick}>
          <Edit />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <Section title='Basic info' headerOptions={<HeaderOptions />}>
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <SectionRowStyles>
            <SectionRowTitleStyles>Name</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <TextField
                required
                className={classes.textField}
                autoComplete='off'
                autoFocus
                name='name'
                type='text'
                value={name}
                onChange={handleChange}
                label='Service name'
                variant='outlined'
              />
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Description</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <TextField
                className={classes.textField}
                autoComplete='off'
                name='description'
                type='text'
                value={description}
                onChange={handleChange}
                label='Description'
                variant='outlined'
                multiline
                rows={4}
              />
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Version</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <TextField
                className={classes.textField}
                autoComplete='off'
                name='version'
                type='text'
                value={version}
                onChange={handleChange}
                label='Version'
                variant='outlined'
              />
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Server</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <Autocomplete
                className={classes.textField}
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
                    placeholder="Search by server's name, IP address, MAC address, or ID"
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
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Repository</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <Autocomplete
                className={classes.textField}
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
            </Fade>
          </SectionRowStyles>

          <input type='submit' hidden />
        </form>
      ) : (
        <>
          <SectionRowStyles>
            <SectionRowTitleStyles>ID</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>{currentService.id}</SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Name</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>{name}</SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Description</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>
                {description || <em>No description provided</em>}
              </SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Version</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>{version}</SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Cluster</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>
                {currentService.cluster && (
                  <Link
                    to={`${ROUTE_PATHS.CLUSTERS}/${currentService.cluster.id}`}
                  >
                    {currentService.cluster.name}
                  </Link>
                )}
              </SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Server</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>
                {currentService.server ? (
                  <Link
                    to={`${ROUTE_PATHS.SERVERS}/${currentService.server.id}`}
                  >
                    {currentService.server.name}
                  </Link>
                ) : (
                  <em>No information</em>
                )}
              </SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Repository</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>
                {currentService.repository ? (
                  <Link
                    to={`${ROUTE_PATHS.REPOSITORIES}/${currentService.repository.id}`}
                  >
                    {currentService.repository.name}
                  </Link>
                ) : (
                  <em>No information</em>
                )}
              </SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
        </>
      )}
    </Section>
  );
};

export default ServiceBasicInfoSection;
