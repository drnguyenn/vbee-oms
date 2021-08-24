import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { capitalize, kebabCase } from 'lodash';
import pluralize from 'pluralize';

import {
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  Typography
} from '@material-ui/core';
import { GroupAdd, MoreVert, Close, Check, Refresh } from '@material-ui/icons';

import {
  setRepositoryMemberAdditionModalOpen,
  setRepositoryMemberRemovalConfirmationModalOpen
} from 'redux/modal/modal.actions';
import {
  fetchRepositoryMembersStart,
  setCurrentRepositoryMember,
  updateRepositoryInvitationStart
} from 'redux/repository/repository.actions';

import Section from 'components/section/section.component';
import Table, {
  RowLoader,
  ToolbarLoader
} from 'components/table/table.component';

const menuPropsAreEqual = (prevProps, nextProps) =>
  prevProps.open === nextProps.open &&
  prevProps.anchorEl === nextProps.anchorEl &&
  prevProps.permissionChangeable === nextProps.permissionChangeable;

const MemberActionMenu = memo(
  ({
    open,
    anchorEl,
    permissionChangeable,
    handleClose,
    handleChangeMemberPermission,
    handleRemoveMember
  }) => (
    <Menu anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
      {permissionChangeable && (
        <MenuItem onClick={handleChangeMemberPermission}>
          Change permission
        </MenuItem>
      )}
      <MenuItem onClick={handleRemoveMember}>Remove</MenuItem>
    </Menu>
  ),
  menuPropsAreEqual
);

const CustomToolbar = () => {
  const { currentRepository, isFetchingMembers, isAddingMembers } = useSelector(
    state => state.repository
  );

  const dispatch = useDispatch();

  const handleRefreshClick = () =>
    dispatch(fetchRepositoryMembersStart(currentRepository.id));

  const handleAddMemberClick = () =>
    dispatch(setRepositoryMemberAdditionModalOpen(true));

  return (
    <>
      {isFetchingMembers ? (
        <ToolbarLoader tooltipTitle='Fetching data...' />
      ) : (
        <Tooltip title='Refresh'>
          <IconButton onClick={handleRefreshClick}>
            <Refresh />
          </IconButton>
        </Tooltip>
      )}

      {isAddingMembers ? (
        <ToolbarLoader />
      ) : (
        <Tooltip title='Add new member'>
          <IconButton onClick={handleAddMemberClick}>
            <GroupAdd color='primary' />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

const Subtitle = memo(({ memberCount }) => (
  <span>
    <b>{memberCount}</b> {pluralize('member', memberCount)} joined this
    repository
  </span>
));

const RepositoryMembersSection = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [targetRow, setTargetRow] = useState([]);
  const [id, username, githubUsername, invitation, permission] = targetRow;

  const [editMode, setEditMode] = useState(false);

  const [permissionChangeable, setPermissionChangeable] = useState(false);
  const [memberPermission, setMemberPermission] = useState('write');

  const {
    currentRepository,
    isFetchingMembers,
    isAddingMembers,
    isUpdatingInvitation,
    isRemovingMembers
  } = useSelector(state => state.repository);

  const dispatch = useDispatch();

  useEffect(() => {
    if (permission) setMemberPermission(permission);
  }, [permission]);

  const handleMenu = event => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleCancelClick = () => setEditMode(false);

  const handleChange = event => {
    setMemberPermission(event.target.value);
  };

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      dispatch(
        updateRepositoryInvitationStart(currentRepository.id, id, {
          permission: memberPermission
        })
      );

      setEditMode(false);
    },
    [dispatch, currentRepository.id, id, memberPermission]
  );

  const data = useMemo(
    () =>
      currentRepository.members.map(
        ({
          user,
          permission: memPermission,
          invitation: memberInvitation
        }) => ({
          ...user,
          permission: memPermission,
          invitation: memberInvitation
        })
      ),
    [currentRepository.members]
  );

  const columns = useMemo(() => {
    const GitHubUsernameColumn = (value, { rowData }) =>
      rowData[3].status === 'accepted' ? (
        value
      ) : (
        <>
          <Typography variant='body2' gutterBottom>
            {value}
          </Typography>
          <Tooltip
            title={
              <span>
                Expires on{' '}
                <b>
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: 'full',
                    timeStyle: 'long'
                  }).format(new Date(rowData[3].expiresAt))}
                </b>
              </span>
            }
            placement='top'
            arrow
          >
            <Typography variant='body2' color='textSecondary'>
              Pending Invite
            </Typography>
          </Tooltip>
        </>
      );

    const InvitationColumn = ({ status, expiresAt }) =>
      status === 'accepted' ? (
        capitalize(status)
      ) : (
        <Tooltip
          title={
            <span>
              Expires on{' '}
              <b>
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: 'full',
                  timeStyle: 'long'
                }).format(new Date(expiresAt))}
              </b>
            </span>
          }
          placement='top'
          arrow
        >
          <span>{capitalize(status)}</span>
        </Tooltip>
      );

    const PermissionColumn = (value, { rowData }) =>
      editMode && rowData[0] === id ? (
        <FormControl variant='outlined'>
          <InputLabel>Permission</InputLabel>
          <Select
            value={memberPermission}
            onChange={handleChange}
            label='Permission'
          >
            <MenuItem value='read'>Read</MenuItem>
            <MenuItem value='write'>Write</MenuItem>
            <MenuItem value='admin'>Admin</MenuItem>
          </Select>
        </FormControl>
      ) : (
        capitalize(value)
      );

    const ActionsColumn = (value, { rowData }) => {
      const [memberId, , , memberInvitation] = rowData;
      if (editMode && memberId === id)
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

      return (isUpdatingInvitation && memberId === id) ||
        (isRemovingMembers && memberId === id) ? (
        <RowLoader />
      ) : (
        <IconButton
          onClick={event => {
            if (
              memberInvitation.status === 'pending' &&
              Date.now() < new Date(memberInvitation.expiresAt).getTime()
            )
              setPermissionChangeable(true);
            else setPermissionChangeable(false);

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
          filter: true,
          customBodyRender: GitHubUsernameColumn
        }
      },
      {
        name: 'invitation',
        label: 'Invitation',
        options: {
          filter: true,
          display: false,
          customBodyRender: InvitationColumn
        }
      },
      {
        name: 'permission',
        label: 'Permission',
        options: {
          filter: true,
          customBodyRender: PermissionColumn
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
    editMode,
    id,
    memberPermission,
    handleSubmit,
    isUpdatingInvitation,
    isRemovingMembers
  ]);

  const options = useMemo(
    () => ({
      downloadFilename: kebabCase(`${currentRepository.name}-members.csv`),
      customToolbar: () => <CustomToolbar />
    }),
    [currentRepository.name]
  );

  return (
    <Section
      title='Members'
      subtitle={
        currentRepository.memberCount ? (
          <Subtitle memberCount={currentRepository.memberCount} />
        ) : null
      }
    >
      <Table
        columns={columns}
        data={data}
        options={options}
        isLoading={
          isFetchingMembers ||
          isAddingMembers ||
          isUpdatingInvitation ||
          isRemovingMembers
        }
      />

      <MemberActionMenu
        {...{
          anchorEl,
          open,
          permissionChangeable,
          handleClose,
          handleChangeMemberPermission: () => {
            setEditMode(true);
            handleClose();
          },
          handleRemoveMember: () => {
            dispatch(
              setCurrentRepositoryMember({
                id,
                username,
                githubUsername,
                invitation,
                permission
              })
            );

            dispatch(setRepositoryMemberRemovalConfirmationModalOpen(true));

            handleClose();
          }
        }}
      />
    </Section>
  );
};

export default RepositoryMembersSection;
