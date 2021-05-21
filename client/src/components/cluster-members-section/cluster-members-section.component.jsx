import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { capitalize, kebabCase } from 'lodash';

import {
  Menu,
  MenuItem,
  IconButton,
  CircularProgress,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  makeStyles
} from '@material-ui/core';
import { GroupAdd, MoreVert, Close, Check } from '@material-ui/icons';

import {
  toggleClusterMemberAdditionModal,
  toggleClusterMemberRemoveConfirmationModal
} from '../../redux/modal/modal.actions';
import {
  setCurrentClusterMember,
  updateClusterMemberStart
} from '../../redux/cluster/cluster.actions';

import Section from '../section/section.component';
import Table from '../table/table.component';

const useStyles = makeStyles({
  circularProgress: {
    margin: 14,
    verticalAlign: 'middle'
  }
});

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

const customToolbarPropsAreEqual = (prevProps, nextProps) =>
  prevProps.isAddingMembers === nextProps.isAddingMembers;

const CustomToolbar = memo(({ isAddingMembers, handleAddMemberClick }) => {
  const classes = useStyles();

  return isAddingMembers ? (
    <Tooltip title='Processing...'>
      <CircularProgress className={classes.circularProgress} size={20} />
    </Tooltip>
  ) : (
    <Tooltip title='Add new member'>
      <IconButton onClick={handleAddMemberClick}>
        <GroupAdd color='primary' />
      </IconButton>
    </Tooltip>
  );
}, customToolbarPropsAreEqual);

const Subtitle = ({ memberCount }) => (
  <span>
    <b>{memberCount}</b> member
    {memberCount > 1 ? 's ' : ' '}joined this cluster
  </span>
);

const ClusterMembersSection = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [targetRow, setTargetRow] = useState([]);

  const handleMenu = event => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

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
    if (targetRow.length) setMemberRole(targetRow[4]);
  }, [targetRow]);

  const handleAddMemberClick = () =>
    dispatch(toggleClusterMemberAdditionModal());

  const handleCancelClick = () => setEditMode(false);

  const handleChange = event => {
    setMemberRole(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();

    dispatch(
      updateClusterMemberStart(currentCluster.id, targetRow[0], {
        role: memberRole
      })
    );

    setEditMode(false);
  };

  const RoleColumn = (value, { rowData }) =>
    editMode && rowData[0] === targetRow[0] ? (
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
    if (editMode && rowData[0] === targetRow[0])
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

    return (isUpdatingMembers && rowData[0] === targetRow[0]) ||
      (isRemovingMembers && rowData[0] === targetRow[0]) ? (
      <CircularProgress size={25} />
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

  const columns = [
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

  return (
    <Section
      title='Members'
      subtitle={memberCount ? <Subtitle memberCount={memberCount} /> : null}
    >
      <Table
        columns={columns}
        data={members.map(({ role, user: { role: systemRole, ...rest } }) => ({
          role,
          ...rest
        }))}
        options={{
          downloadFilename: kebabCase(`${currentCluster.name}-members.csv`),
          customToolbar: () => (
            <CustomToolbar {...{ isAddingMembers, handleAddMemberClick }} />
          )
        }}
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
                id: targetRow[0],
                fullName: targetRow[1],
                username: targetRow[2],
                githubUsername: targetRow[3],
                role: targetRow[4]
              })
            );

            dispatch(toggleClusterMemberRemoveConfirmationModal());

            handleClose();
          }
        }}
      />
    </Section>
  );
};

export default ClusterMembersSection;
