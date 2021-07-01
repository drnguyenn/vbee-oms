import { memo, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  IconButton,
  Tooltip,
  CircularProgress,
  makeStyles,
  Typography,
  Menu,
  MenuItem
} from '@material-ui/core';
import { Add, CheckCircle, Error, MoreVert, Refresh } from '@material-ui/icons';

import {
  getAllServerDomainsSslStatusStart,
  setCurrentServerDomain
} from 'redux/server/server.actions';
import {
  setServerDomainAdditionModalOpen,
  setServerDomainRemovalConfirmationModalOpen,
  setServerDomainUpdateModalOpen
} from 'redux/modal/modal.actions';

import Section from 'components/section/section.component';
import Table from 'components/table/table.component';

import themes from 'themes';

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
    dispatch(setServerDomainAdditionModalOpen(true));

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

const Subtitle = memo(({ domainCount }) => (
  <span>
    <b>{domainCount}</b>{' '}
    {domainCount > 1 ? 'domains represent' : 'domain represents'} this
    server&apos;s IP address
  </span>
));

const ServerDomainsSection = () => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [targetRow, setTargetRow] = useState([]);

  const handleMenu = event => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const {
    currentServer,
    isGettingSslStatus,
    isUpdatingDomains,
    isRemovingDomains
  } = useSelector(state => state.server);
  const { domainCount } = currentServer;

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentServer.id)
      dispatch(getAllServerDomainsSslStatusStart(currentServer.id));
  }, [currentServer.id, dispatch]);

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
      title='Domains'
      subtitle={domainCount ? <Subtitle domainCount={domainCount} /> : null}
    >
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
            dispatch(setServerDomainUpdateModalOpen(true));

            handleClose();
          },
          handleRemoveDomain: () => {
            dispatch(
              setCurrentServerDomain({
                id: targetRow[0],
                value: targetRow[1]
              })
            );

            dispatch(setServerDomainRemovalConfirmationModalOpen(true));

            handleClose();
          }
        }}
      />
    </Section>
  );
};

export default ServerDomainsSection;
