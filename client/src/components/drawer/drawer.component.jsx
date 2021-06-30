import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import {
  Button,
  Divider,
  CircularProgress,
  Fade,
  Grid,
  IconButton,
  LinearProgress,
  Tooltip,
  Slide,
  TextField,
  Typography,
  makeStyles,
  useTheme
} from '@material-ui/core';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { Close, Edit, Web } from '@material-ui/icons';

import { searchServices } from 'services/service.service';

import {
  setSelectedDiagramNode,
  setShowDrawer,
  linkNodeToServiceStart,
  updateClusterDiagramNodeStart
} from 'redux/diagram/diagram.actions';

import ROUTE_PATHS from 'router/route-paths';

import {
  DrawerStyles,
  HeaderStyles,
  BodyStyles,
  NodeUpdateFormStyles,
  SectionRowStyles,
  SectionRowTitleStyles,
  SectionRowValueStyles
} from './drawer.styles';

const useStyles = makeStyles({
  bodyGrid: {
    height: '90%'
  },
  headerGrid: {
    '&:hover': {
      '& .title-edit-button--hover': {
        visibility: 'visible'
      }
    }
  },
  headerTitle: {
    maxWidth: '85%',
    marginRight: '0.5rem',
    whiteSpace: 'nowrap'
  },
  titleEditButton: {
    visibility: 'hidden'
  },
  divider: {
    margin: '1rem 0'
  },
  linearProgress: {
    position: 'absolute',
    width: '100%',
    top: 0,
    marginLeft: '-1rem'
  },
  serverSection: {
    margin: '1rem 0'
  }
});

const initialNodeInfo = {
  name: ''
};

const handleSearchServices = async (query = {}, callback = () => {}) => {
  const clusters = await searchServices(query);

  callback(clusters);
};

const serviceFilterOptions = createFilterOptions({
  stringify: ({ id, name, description }) => `${id}${name}${description}`,
  trim: true
});

const Header = memo(({ handleCloseDrawer }) => {
  const classes = useStyles();

  const { selectedNode } = useSelector(state => state.diagram);

  const [editMode, setEditMode] = useState(false);

  const [nodeInfo, setNodeInfo] = useState({ name: '' });
  const { name } = nodeInfo;

  const dispatch = useDispatch();

  const handleChange = event => {
    const { name: elementName, value } = event.target;
    setNodeInfo({ ...nodeInfo, [elementName]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();

    dispatch(updateClusterDiagramNodeStart(selectedNode.id, nodeInfo));

    setEditMode(false);
  };

  const handleEscKeyUp = event => {
    if (event.key === 'Escape') {
      setNodeInfo({
        name: selectedNode.name || ''
      });
      setEditMode(false);
    }
  };

  const handleEditClick = () => setEditMode(true);

  useEffect(() => {
    setEditMode(false);

    if (selectedNode) {
      setNodeInfo(prevNodeInfo => ({
        ...prevNodeInfo,
        name: selectedNode.name
      }));
    } else setNodeInfo(initialNodeInfo);
  }, [selectedNode]);

  return (
    <HeaderStyles>
      {editMode ? (
        <Fade in timeout={500}>
          <form onSubmit={handleSubmit}>
            <TextField
              autoComplete='off'
              autoFocus
              name='name'
              type='text'
              value={name}
              onChange={handleChange}
              onKeyUp={handleEscKeyUp}
              label='Node name'
              variant='outlined'
              margin='dense'
            />
          </form>
        </Fade>
      ) : (
        <>
          <Grid className={classes.headerGrid} container alignItems='center'>
            <Tooltip title={name} arrow enterDelay={500}>
              <Typography
                className={classes.headerTitle}
                variant='h6'
                component='h1'
              >
                {name.length <= 20 ? name : `${name.substring(0, 20)}...`}
              </Typography>
            </Tooltip>
            {selectedNode && (
              <Tooltip
                className={`${classes.titleEditButton} title-edit-button--hover`}
                title='Edit'
                arrow
              >
                <IconButton onClick={handleEditClick} size='small'>
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
          </Grid>

          <Tooltip title='Close' arrow>
            <IconButton onClick={handleCloseDrawer} size='small'>
              <Close />
            </IconButton>
          </Tooltip>
        </>
      )}
    </HeaderStyles>
  );
});

const Drawer = () => {
  const classes = useStyles();
  const theme = useTheme();

  const { showDrawer, selectedNode, isLinkingNodeToService } = useSelector(
    state => state.diagram
  );

  const [editMode, setEditMode] = useState(false);

  const [serviceOptions, setServiceOptions] = useState([]);
  const [serviceValue, setServiceValue] = useState(null);
  const [serviceInputValue, setServiceInputValue] = useState('');
  const [isFetchingService, setIsFetchingService] = useState(false);

  const { id } = useParams();
  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    setIsFetchingService(true);

    handleSearchServices({ cluster: id }, results => {
      setServiceOptions(results);

      setIsFetchingService(false);
    });
  }, [id]);

  const handleClose = useCallback(() => {
    dispatch(setShowDrawer(false));
    dispatch(setSelectedDiagramNode(null));
  }, [dispatch]);

  const handleServiceValueChange = (event, newValue) => {
    setServiceValue(newValue);
  };

  const handleServiceInputChange = (event, newInputValue) => {
    setServiceInputValue(newInputValue);
  };

  const handleSubmit = event => {
    event.preventDefault();

    dispatch(
      linkNodeToServiceStart(
        selectedNode.id,
        serviceValue ? serviceValue.id : null
      )
    );

    setEditMode(false);
  };

  useEffect(() => {
    if (showDrawer && selectedNode) {
      setEditMode(false);

      if (selectedNode.service) setServiceValue(selectedNode.service);
      else setServiceValue(null);
    }
  }, [selectedNode, showDrawer]);

  if (!selectedNode)
    return (
      <Slide direction='left' in={showDrawer} mountOnEnter unmountOnExit>
        <DrawerStyles backgroundColor={theme.palette.background.paper}>
          <Header handleCloseDrawer={handleClose} />

          <Grid
            className={classes.bodyGrid}
            container
            direction='column'
            justify='center'
            alignItems='center'
          >
            <Grid item>
              <Typography>Select a node to view details</Typography>
            </Grid>
          </Grid>
        </DrawerStyles>
      </Slide>
    );

  const getBody = () => {
    const { service } = selectedNode;

    if (editMode)
      return (
        <NodeUpdateFormStyles onSubmit={handleSubmit}>
          <Fade in={editMode} timeout={500}>
            <Autocomplete
              fullWidth
              value={serviceValue}
              inputValue={serviceInputValue}
              onChange={handleServiceValueChange}
              onInputChange={handleServiceInputChange}
              filterOptions={serviceFilterOptions}
              includeInputInList
              getOptionSelected={(option, selectedValue) =>
                option.id === selectedValue.id
              }
              getOptionLabel={option => option.name}
              options={serviceOptions}
              noOptionsText='No matching results found'
              loading={isFetchingService && !serviceOptions.length}
              loadingText='Searching...'
              renderInput={params => (
                <TextField
                  {...params}
                  label='Choose a service'
                  placeholder="Enter service's ID, name, or description"
                  margin='normal'
                  variant='outlined'
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isFetchingService ? (
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
                    {option.description.length <= 30
                      ? option.description
                      : `${option.description.substring(0, 30)}...`}
                  </Typography>
                </div>
              )}
            />
          </Fade>

          <Grid
            container
            direction='row'
            justify='flex-end'
            alignItems='center'
            spacing={1}
          >
            <Grid item>
              <Button
                onClick={() => setEditMode(false)}
                variant='outlined'
                disabled={isLinkingNodeToService}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                disabled={isLinkingNodeToService}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </NodeUpdateFormStyles>
      );

    if (service) {
      const { server } = service;
      let metrics;
      if (server) ({ metrics = {} } = server);

      return (
        <>
          <Grid container justify='space-between' alignItems='center'>
            <Typography color='primary'>Service</Typography>
            <Tooltip title='Link to another service' arrow>
              <IconButton onClick={() => setEditMode(true)}>
                <Web />
              </IconButton>
            </Tooltip>
          </Grid>

          <SectionRowStyles>
            <SectionRowTitleStyles>Name</SectionRowTitleStyles>
            <SectionRowValueStyles>{service.name}</SectionRowValueStyles>
          </SectionRowStyles>
          <SectionRowStyles>
            <SectionRowTitleStyles>Description</SectionRowTitleStyles>
            <SectionRowValueStyles>
              {!service.description && <em>No description provided</em>}
              {service.description.length <= 70
                ? service.description
                : `${service.description.substring(0, 70)}...`}
            </SectionRowValueStyles>
          </SectionRowStyles>
          <SectionRowStyles>
            <SectionRowTitleStyles>Version</SectionRowTitleStyles>
            <SectionRowValueStyles>{service.version}</SectionRowValueStyles>
          </SectionRowStyles>

          <Divider className={classes.divider} />

          <Typography color='primary'>Server</Typography>

          {server ? (
            <>
              <SectionRowStyles>
                <SectionRowTitleStyles>IP address</SectionRowTitleStyles>
                <SectionRowValueStyles>
                  {server.ipAddress}
                </SectionRowValueStyles>
              </SectionRowStyles>
              <SectionRowStyles>
                <SectionRowTitleStyles>CPU usage</SectionRowTitleStyles>
                <SectionRowValueStyles>
                  {metrics.cpuUsage > 0
                    ? `${metrics.cpuUsage.toFixed(1)}%`
                    : '--'}
                </SectionRowValueStyles>
              </SectionRowStyles>
              <SectionRowStyles>
                <SectionRowTitleStyles>Memory usage</SectionRowTitleStyles>
                <SectionRowValueStyles>
                  {metrics.memoryUsage > 0
                    ? `${metrics.memoryUsage.toFixed(1)}%`
                    : '--'}
                </SectionRowValueStyles>
              </SectionRowStyles>
              <SectionRowStyles>
                <SectionRowTitleStyles>Inbound network</SectionRowTitleStyles>
                <SectionRowValueStyles>
                  {metrics.networkIn > 0
                    ? `${metrics.networkIn.toFixed(1)} KB/s`
                    : '--'}
                </SectionRowValueStyles>
              </SectionRowStyles>
              <SectionRowStyles>
                <SectionRowTitleStyles>Outbound network</SectionRowTitleStyles>
                <SectionRowValueStyles>
                  {metrics.networkOut > 0
                    ? `${metrics.networkOut.toFixed(1)} KB/s`
                    : '--'}
                </SectionRowValueStyles>
              </SectionRowStyles>
            </>
          ) : (
            <Grid
              className={classes.serverSection}
              container
              direction='column'
              justify='center'
              alignItems='center'
            >
              <Grid item>
                <Typography variant='body2' gutterBottom>
                  This service seems to have no information about the server.
                  Associate it with a certain server to start fetching metrics.
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  color='primary'
                  onClick={() =>
                    history.push(`${ROUTE_PATHS.SERVICES}/${service.id}`)
                  }
                >
                  Go to Service Details Page
                </Button>
              </Grid>
            </Grid>
          )}
        </>
      );
    }

    return (
      <Grid
        className={classes.bodyGrid}
        container
        direction='column'
        justify='center'
        alignItems='center'
      >
        <Grid item>
          <Typography gutterBottom>
            This node is not linked with any service
          </Typography>
        </Grid>
        <Grid item>
          <Button color='primary' onClick={() => setEditMode(true)}>
            Link now
          </Button>
        </Grid>
      </Grid>
    );
  };

  return (
    <Slide direction='left' in={showDrawer} mountOnEnter unmountOnExit>
      <DrawerStyles backgroundColor={theme.palette.background.paper}>
        {isLinkingNodeToService && (
          <LinearProgress className={classes.linearProgress} />
        )}

        <Header handleCloseDrawer={handleClose} />

        <BodyStyles>{getBody()}</BodyStyles>
      </DrawerStyles>
    </Slide>
  );
};

export default memo(Drawer);
