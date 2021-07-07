import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { capitalize } from 'lodash';

import {
  Menu,
  MenuItem,
  IconButton,
  CircularProgress,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  makeStyles,
  Grid,
  Fab
} from '@material-ui/core';
import { Add, MoreVert, Close, Check, Refresh } from '@material-ui/icons';

import {
  fetchAllUsersStart,
  setSelectedUser,
  updateUserStart
} from 'redux/user/user.actions';
import {
  setUserCreationModalOpen,
  setUserDeleteConfirmationModalOpen
} from 'redux/modal/modal.actions';

import BasePage from 'pages/base/base.component';

import Table from 'components/table/table.component';

// import ROUTE_PATHS from 'router/route-paths';

const useStyles = makeStyles(theme => ({
  fabGroup: {
    position: 'fixed',
    width: 'fit-content',
    bottom: theme.spacing(4),
    right: theme.spacing(4)
  },
  refreshButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 64
  },
  gridItem: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: '0.625rem'
  },
  spinner: {
    zIndex: 1100
  }
}));

const menuPropsAreEqual = (prevProps, nextProps) =>
  prevProps.open === nextProps.open &&
  prevProps.anchorEl === nextProps.anchorEl;

const MemberActionMenu = memo(
  ({
    open,
    anchorEl,
    handleClose,
    handleChangeMemberRole,
    handleRemoveMember
  }) => (
    <Menu anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
      <MenuItem onClick={handleChangeMemberRole}>Change role</MenuItem>
      <MenuItem onClick={handleRemoveMember}>Remove</MenuItem>
    </Menu>
  ),
  menuPropsAreEqual
);

const CustomToolbar = () => {
  const classes = useStyles();

  const { isFetchingUsers } = useSelector(state => state.user);

  const dispatch = useDispatch();

  const handleRefreshClick = () => dispatch(fetchAllUsersStart());

  return (
    <>
      {isFetchingUsers ? (
        <Tooltip title='Fetching data...'>
          <CircularProgress className={classes.circularProgress} size={20} />
        </Tooltip>
      ) : (
        <Tooltip title='Refresh'>
          <IconButton onClick={handleRefreshClick}>
            <Refresh />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

const UsersPage = () => {
  const classes = useStyles();

  const { users, isFetchingUsers, isProcessing, isUpdatingInfo } = useSelector(
    state => state.user
  );

  // const history = useHistory();

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [targetRow, setTargetRow] = useState([]);
  const [id, fullName, username, githubUsername, role] = targetRow;

  const [editMode, setEditMode] = useState(false);

  const [memberRole, setMemberRole] = useState('member');

  useEffect(() => {
    if (role) setMemberRole(role);
  }, [role]);

  const handleMenu = event => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleCancelClick = () => setEditMode(false);

  const handleChange = event => {
    setMemberRole(event.target.value);
  };

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      dispatch(
        updateUserStart(id, {
          role: memberRole
        })
      );

      setEditMode(false);
    },
    [dispatch, id, memberRole]
  );

  useEffect(() => {
    if (!users.length) dispatch(fetchAllUsersStart());
  }, [users.length, dispatch]);

  const handleAddButtonClick = () => {
    dispatch(setUserCreationModalOpen(true));
  };

  const columns = useMemo(() => {
    const RoleColumn = (value, { rowData }) =>
      editMode && rowData[0] === id ? (
        <FormControl variant='outlined'>
          <InputLabel>Role</InputLabel>
          <Select value={memberRole} onChange={handleChange} label='Role'>
            <MenuItem value='member'>Member</MenuItem>
            <MenuItem value='admin'>Admin</MenuItem>
          </Select>
        </FormControl>
      ) : (
        capitalize(value)
      );

    const ActionsColumn = (value, { rowData }) => {
      if (editMode && rowData[0] === id)
        return (
          <div>
            <Tooltip title='Cancel' arrow>
              <IconButton onClick={handleCancelClick}>
                <Close />
              </IconButton>
            </Tooltip>
            <Tooltip title='Save' arrow>
              <IconButton onClick={handleSubmit}>
                <Check />
              </IconButton>
            </Tooltip>
          </div>
        );

      return isUpdatingInfo && rowData[0] === id ? (
        <div className={classes.rowLoader}>
          <CircularProgress size={20} />
        </div>
      ) : (
        <IconButton
          onClick={event => {
            handleMenu(event);
            setTargetRow(rowData);
          }}
          disabled={editMode}
        >
          <MoreVert />
        </IconButton>
      );
    };

    return [
      {
        name: 'id',
        label: 'UID',
        options: {
          filter: true
        }
      },
      {
        name: 'fullName',
        label: 'Full name',
        options: {
          filter: true
        }
      },
      {
        name: 'username',
        label: 'Username',
        options: {
          filter: true
        }
      },
      {
        name: 'githubUsername',
        label: 'GitHub username',
        options: {
          filter: true
        }
      },
      {
        name: 'role',
        label: 'Role',
        options: {
          filter: true,
          customBodyRender: RoleColumn
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
  }, [
    classes.rowLoader,
    editMode,
    handleSubmit,
    id,
    isUpdatingInfo,
    memberRole
  ]);

  const options = useMemo(
    () => ({
      downloadFilename: 'users.csv',
      customToolbar: () => <CustomToolbar />
      // onRowClick: rowData => console.log(rowData)
    }),
    []
  );

  return (
    <BasePage
      title='Users'
      subtitle={`There are total of ${users.length} user${
        users.length > 1 ? 's' : ''
      } here`}
    >
      <Table
        columns={columns}
        data={users}
        options={options}
        isLoading={isFetchingUsers || isProcessing}
      />

      <MemberActionMenu
        {...{
          anchorEl,
          open,
          handleClose,
          handleChangeMemberRole: () => {
            setEditMode(true);
            handleClose();
          },
          handleRemoveMember: () => {
            dispatch(
              setSelectedUser({
                id,
                fullName,
                username,
                githubUsername,
                role
              })
            );

            dispatch(setUserDeleteConfirmationModalOpen(true));

            handleClose();
          }
        }}
      />

      <Grid
        className={classes.fabGroup}
        container
        direction='column'
        spacing={1}
      >
        <Grid item>
          <Tooltip title='Create new user account' placement='left' arrow>
            <Fab color='primary' onClick={handleAddButtonClick}>
              <Add />
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
    </BasePage>
  );
};

export default UsersPage;
