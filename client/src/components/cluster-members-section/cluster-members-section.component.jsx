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
  Select
} from '@material-ui/core';
import { GroupAdd, MoreVert, Close, Check } from '@material-ui/icons';

import {
  setClusterMemberAdditionModalOpen,
  setClusterMemberRemovalConfirmationModalOpen
} from 'redux/modal/modal.actions';
import {
  setCurrentClusterMember,
  updateClusterMemberStart
} from 'redux/cluster/cluster.actions';

import Section from 'components/section/section.component';
import Table, {
  RowLoader,
  ToolbarLoader
} from 'components/table/table.component';

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
  const { isAddingMembers } = useSelector(state => state.cluster);

  const dispatch = useDispatch();

  const handleAddMemberClick = () =>
    dispatch(setClusterMemberAdditionModalOpen(true));

  return isAddingMembers ? (
    <ToolbarLoader />
  ) : (
    <Tooltip title='Add new member'>
      <IconButton onClick={handleAddMemberClick}>
        <GroupAdd color='primary' />
      </IconButton>
    </Tooltip>
  );
};

const Subtitle = memo(({ memberCount }) => (
  <span>
    <b>{memberCount}</b> {pluralize('member', memberCount)} joined this cluster
  </span>
));

const ClusterMembersSection = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [targetRow, setTargetRow] = useState([]);
  const [id, fullName, username, githubUsername, role] = targetRow;

  const [editMode, setEditMode] = useState(false);

  const [memberRole, setMemberRole] = useState('member');

  const {
    currentCluster,
    isAddingMembers,
    isUpdatingMembers,
    isRemovingMembers
  } = useSelector(state => state.cluster);

  const { members = [], memberCount = 0 } = currentCluster;

  const dispatch = useDispatch();

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
        updateClusterMemberStart(currentCluster.id, id, {
          role: memberRole
        })
      );

      setEditMode(false);
    },
    [dispatch, currentCluster.id, id, memberRole]
  );

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

      return (isUpdatingMembers && rowData[0] === id) ||
        (isRemovingMembers && rowData[0] === id) ? (
        <RowLoader />
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
    editMode,
    handleSubmit,
    id,
    isRemovingMembers,
    isUpdatingMembers,
    memberRole
  ]);

  const options = useMemo(
    () => ({
      downloadFilename: kebabCase(`${currentCluster.name}-members.csv`),
      customToolbar: () => <CustomToolbar />
    }),
    [currentCluster.name]
  );

  return (
    <Section
      title='Members'
      subtitle={memberCount ? <Subtitle memberCount={memberCount} /> : null}
    >
      <Table
        columns={columns}
        data={members.map(
          ({ role: memRole, user: { role: systemRole, ...rest } }) => ({
            role: memRole,
            ...rest
          })
        )}
        options={options}
        isLoading={isAddingMembers || isUpdatingMembers || isRemovingMembers}
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
              setCurrentClusterMember({
                id,
                fullName,
                username,
                githubUsername,
                role
              })
            );

            dispatch(setClusterMemberRemovalConfirmationModalOpen(true));

            handleClose();
          }
        }}
      />
    </Section>
  );
};

export default ClusterMembersSection;
