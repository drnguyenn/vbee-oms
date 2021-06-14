import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  IconButton,
  Tooltip,
  TextField,
  Fade,
  CircularProgress,
  makeStyles,
  Typography,
  Menu,
  MenuItem
} from '@material-ui/core';
import {
  Add,
  Check,
  CheckCircle,
  Close,
  Edit,
  Error,
  MoreVert,
  Refresh
} from '@material-ui/icons';

import {
  fetchServerStart,
  getAllServerDomainsSslStatusStart,
  setCurrentServerDomain,
  updateServerInfoStart
} from '../../redux/server/server.actions';
import {
  toggleServerDomainAdditionModal,
  toggleServerDomainRemoveConfirmationModal,
  toggleServerDomainUpdateModal
} from '../../redux/modal/modal.actions';

import Spinner from '../spinner/spinner.component';
import Section from '../section/section.component';
import Table from '../table/table.component';

import {
  SectionRowStyles,
  SectionRowTitleStyles,
  SectionRowValueStyles
} from '../section/section.styles';

import themes from '../../themes';

const useStyles = makeStyles(muiTheme => ({
  textField: {
    width: '70%'
  },
  sslStatus: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 'inherit'
  },
  icon: {
    marginRight: themes.lengthSm1
  },
  success: {
    color: muiTheme.palette.success.light
  },
  spinner: {
    position: 'absolute',
    zIndex: 101,
    borderRadius: muiTheme.shape.borderRadius
  },
  toolbarIcon: {
    '&:hover': {
      color: muiTheme.palette.primary.main
    }
  },
  circularProgress: {
    margin: 14,
    verticalAlign: 'middle'
  }
}));

const menuPropsAreEqual = (prevProps, nextProps) =>
  prevProps.open === nextProps.open &&
  prevProps.anchorEl === nextProps.anchorEl;

const DomainActionMenu = memo(
  ({ open, anchorEl, handleClose, handleUpdateDomain, handleRemoveDomain }) => (
    <Menu anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
      <MenuItem onClick={handleUpdateDomain}>Edit</MenuItem>
      <MenuItem onClick={handleRemoveDomain}>Remove</MenuItem>
    </Menu>
  ),
  menuPropsAreEqual
);

const CustomToolbar = () => {
  const classes = useStyles();

  const { currentServer, isGettingSslStatus, isAddingDomains } = useSelector(
    state => state.server
  );

  const dispatch = useDispatch();

  const handleRefreshClick = () =>
    dispatch(getAllServerDomainsSslStatusStart(currentServer.id));

  const handleAddDomainClick = () =>
    dispatch(toggleServerDomainAdditionModal());

  return (
    <>
      {isGettingSslStatus ? (
        <Tooltip title='Fetching data...'>
          <CircularProgress className={classes.circularProgress} size={20} />
        </Tooltip>
      ) : (
        <Tooltip title='Refresh'>
          <IconButton onClick={handleRefreshClick}>
            <Refresh className={classes.toolbarIcon} />
          </IconButton>
        </Tooltip>
      )}

      {isAddingDomains ? (
        <Tooltip title='Fetching data...'>
          <CircularProgress className={classes.circularProgress} size={20} />
        </Tooltip>
      ) : (
        <Tooltip title='Add new domains'>
          <IconButton onClick={handleAddDomainClick}>
            <Add color='primary' />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

const DateColumn = (value = '-') => {
  if (value === '-') return value;

  const date = new Date(value);

  return (
    <Tooltip
      title={new Intl.DateTimeFormat(undefined, {
        dateStyle: 'full',
        timeStyle: 'long'
      }).format(date)}
      placement='top'
      arrow
    >
      <span>
        {new Intl.DateTimeFormat(undefined, {
          dateStyle: 'long'
        }).format(date)}
      </span>
    </Tooltip>
  );
};

const HeaderOptions = memo(
  ({
    editMode,
    ipAddress,
    handleCancelClick,
    handleEditClick,
    handleSubmit
  }) => {
    const { isUpdatingInfo } = useSelector(state => state.server);

    if (editMode)
      return (
        <div>
          <Tooltip title='Cancel' arrow>
            <IconButton onClick={handleCancelClick}>
              <Close />
            </IconButton>
          </Tooltip>
          {ipAddress.length ? (
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
  }
);

const ServiceServerSection = () => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [targetRow, setTargetRow] = useState([]);

  const handleMenu = event => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const [editMode, setEditMode] = useState(false);

  const { currentService } = useSelector(state => state.service);

  const {
    currentServer,
    isFetchingCurrentServer,
    isUpdatingInfo,
    isGettingSslStatus,
    isUpdatingDomains,
    isRemovingDomains
  } = useSelector(state => state.server);

  const dispatch = useDispatch();

  const [serverInfo, setServerInfo] = useState({ ipAddress: '' });
  const { ipAddress } = serverInfo;

  useEffect(() => {
    const { id } = currentService.server;

    dispatch(fetchServerStart(id));
    dispatch(getAllServerDomainsSslStatusStart(id));
  }, [currentService.server, dispatch]);

  useEffect(() => {
    if (currentServer && !isFetchingCurrentServer && !isUpdatingInfo)
      setServerInfo({ ipAddress: currentServer.ipAddress });
  }, [currentServer, isFetchingCurrentServer, isUpdatingInfo]);

  const handleEditClick = useCallback(() => setEditMode(true), []);

  const handleCancelClick = useCallback(() => {
    setServerInfo({ ipAddress: currentServer.ipAddress || '' });
    setEditMode(false);
  }, [currentServer]);

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();

      dispatch(updateServerInfoStart(currentServer.id, serverInfo));

      setEditMode(false);
    },
    [currentServer, dispatch, serverInfo]
  );

  const handleChange = event => {
    const { name, value } = event.target;
    setServerInfo({ ...serverInfo, [name]: value });
  };

  const columns = useMemo(() => {
    const StatusColumn = (value = '-') => {
      if (value === '-') return value;

      return value ? (
        <Typography className={classes.sslStatus}>
          <CheckCircle
            className={`${classes.icon} ${classes.success}`}
            color='primary'
          />
          OK
        </Typography>
      ) : (
        <Typography className={classes.sslStatus}>
          <Error className={classes.icon} color='error' />
          Expired
        </Typography>
      );
    };

    const ActionsColumn = (value, { rowData }) =>
      (isUpdatingDomains && rowData[0] === targetRow[0]) ||
      (isRemovingDomains && rowData[0] === targetRow[0]) ? (
        <CircularProgress size={25} />
      ) : (
        <IconButton
          onClick={event => {
            handleMenu(event);
            setTargetRow(rowData);
          }}
        >
          <MoreVert />
        </IconButton>
      );

    return [
      {
        name: 'id',
        label: 'ID',
        options: {
          filter: true,
          display: false
        }
      },
      {
        name: 'value',
        label: 'Domain',
        options: {
          filter: true
        }
      },
      {
        name: 'valid',
        label: 'Status',
        options: {
          filter: true,
          customBodyRender: StatusColumn
        }
      },
      {
        name: 'validFrom',
        label: 'Valid from',
        options: {
          filter: true,
          customBodyRender: DateColumn
        }
      },
      {
        name: 'validTo',
        label: 'Valid to',
        options: {
          filter: true,
          customBodyRender: DateColumn
        }
      },
      {
        name: 'daysRemaining',
        label: 'Days remaining',
        options: {
          filter: true
        }
      },
      {
        name: '',
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRender: ActionsColumn
        }
      }
    ];
  }, [classes, isRemovingDomains, isUpdatingDomains, targetRow]);

  const options = useMemo(
    () => ({
      downloadFilename: currentServer
        ? `${currentServer.ipAddress}-domains.csv`
        : 'domains.csv',
      customToolbar: () => <CustomToolbar />
    }),
    [currentServer]
  );

  return (
    <Section
      title='Server'
      headerOptions={
        <HeaderOptions
          {...{
            editMode,
            ipAddress,
            handleCancelClick,
            handleEditClick,
            handleSubmit
          }}
        />
      }
    >
      <Spinner
        open={isFetchingCurrentServer}
        backdropClasses={classes.spinner}
      />

      {editMode ? (
        <form onSubmit={handleSubmit}>
          <SectionRowStyles>
            <SectionRowTitleStyles>IP address</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <TextField
                required
                className={classes.textField}
                autoComplete='off'
                autoFocus
                name='ipAddress'
                type='text'
                value={ipAddress}
                onChange={handleChange}
                label='IP address'
                variant='outlined'
                margin='normal'
              />
            </Fade>
          </SectionRowStyles>
          <input type='submit' hidden />
        </form>
      ) : (
        <SectionRowStyles>
          <SectionRowTitleStyles>IP address</SectionRowTitleStyles>
          <Fade in timeout={500}>
            <SectionRowValueStyles>{ipAddress}</SectionRowValueStyles>
          </Fade>
        </SectionRowStyles>
      )}

      <Table
        title='Domains'
        columns={columns}
        data={currentServer ? currentServer.domains : [['Fetching data...']]}
        options={options}
        isLoading={isGettingSslStatus}
      />

      <DomainActionMenu
        {...{
          anchorEl,
          open,
          handleClose,
          handleUpdateDomain: () => {
            dispatch(
              setCurrentServerDomain({
                id: targetRow[0],
                value: targetRow[1]
              })
            );
            dispatch(toggleServerDomainUpdateModal());

            handleClose();
          },
          handleRemoveDomain: () => {
            dispatch(
              setCurrentServerDomain({
                id: targetRow[0],
                value: targetRow[1]
              })
            );

            dispatch(toggleServerDomainRemoveConfirmationModal());

            handleClose();
          }
        }}
      />
    </Section>
  );
};

export default ServiceServerSection;
