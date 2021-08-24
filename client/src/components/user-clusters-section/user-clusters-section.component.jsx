import { memo, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { kebabCase } from 'lodash';
import pluralize from 'pluralize';

import {
  Button,
  IconButton,
  makeStyles,
  Tooltip,
  Menu,
  MenuItem
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

import { setRemovingUserFromAllClustersConfirmationModalOpen } from 'redux/modal/modal.actions';

import Section from 'components/section/section.component';
import Table, { RowLoader } from 'components/table/table.component';

const useStyles = makeStyles({
  button: {
    display: 'flex',
    margin: '1rem auto 0'
  }
});

const Subtitle = memo(({ clusterCount }) => (
  <span>
    This user has joined <b>{clusterCount}</b>{' '}
    {pluralize('cluster', clusterCount)}
  </span>
));

const DateColumn = value => {
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

const menuPropsAreEqual = (prevProps, nextProps) =>
  prevProps.open === nextProps.open &&
  prevProps.anchorEl === nextProps.anchorEl;

const ActionMenu = memo(
  ({ open, anchorEl, handleClose, handleUpdateRole, handleRemoveMember }) => (
    <Menu anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
      <MenuItem onClick={handleUpdateRole}>Change role</MenuItem>
      <MenuItem onClick={handleRemoveMember}>Remove</MenuItem>
    </Menu>
  ),
  menuPropsAreEqual
);

const UserClustersSection = () => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { selectedUser } = useSelector(state => state.user);
  const { isUpdatingMembers, isRemovingMembers } = useSelector(
    state => state.cluster
  );
  const { clusters, clusterCount } = selectedUser;

  const [targetRow, setTargetRow] = useState([]);
  const [id] = targetRow;

  const handleMenu = event => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const dispatch = useDispatch();

  const columns = useMemo(() => {
    const ActionsColumn = (value, { rowData }) =>
      (isUpdatingMembers && rowData[0] === id) ||
      (isRemovingMembers && rowData[0] === id) ? (
        <RowLoader />
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
        name: 'clusterId',
        label: 'Cluster ID',
        options: {
          filter: true,
          display: false
        }
      },
      {
        name: 'name',
        label: 'Cluster',
        options: {
          filter: true
        }
      },
      {
        name: 'role',
        label: 'Role',
        options: {
          filter: true
        }
      },
      {
        name: 'createdAt',
        label: 'Joined since',
        options: {
          filter: true,
          customBodyRender: DateColumn
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
  }, [id, isRemovingMembers, isUpdatingMembers]);

  const options = useMemo(
    () => ({
      downloadFilename: kebabCase(`${selectedUser.username}-clusters.csv`)
    }),
    [selectedUser.username]
  );

  const handleDeleteButtonClick = () =>
    dispatch(setRemovingUserFromAllClustersConfirmationModalOpen(true));

  return (
    <Section
      title='Clusters'
      subtitle={clusterCount ? <Subtitle clusterCount={clusterCount} /> : null}
    >
      <Table
        columns={columns}
        data={clusters.map(
          ({ cluster: { id: clusterId, name }, role, createdAt }) => ({
            clusterId,
            name,
            role,
            createdAt
          })
        )}
        options={options}
        isLoading={isUpdatingMembers || isRemovingMembers}
      />

      <Button
        variant='outlined'
        color='secondary'
        className={classes.button}
        onClick={handleDeleteButtonClick}
        disabled={!clusters.length}
      >
        Remove user from all clusters
      </Button>

      <ActionMenu
        {...{
          anchorEl,
          open,
          handleClose,
          handleUpdateRole: () => {
            handleClose();
          },
          handleRemoveMember: () => {
            handleClose();
          }
        }}
      />
    </Section>
  );
};

export default UserClustersSection;
