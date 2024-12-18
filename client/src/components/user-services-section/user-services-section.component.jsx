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

import { setRemovingUserFromAllServicesConfirmationModalOpen } from 'redux/modal/modal.actions';

import Section from 'components/section/section.component';
import Table, { RowLoader } from 'components/table/table.component';

const useStyles = makeStyles({
  button: {
    display: 'flex',
    margin: '1rem auto 0'
  }
});

const Subtitle = memo(({ serviceCount }) => (
  <span>
    This user has joined <b>{serviceCount}</b>{' '}
    {pluralize('service', serviceCount)}
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

const UserServicesSection = () => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { selectedUser } = useSelector(state => state.user);
  const { isUpdatingMembers, isRemovingMembers } = useSelector(
    state => state.service
  );
  const { services, serviceCount } = selectedUser;

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
        name: 'serviceId',
        label: 'Service ID',
        options: {
          filter: true,
          display: false
        }
      },
      {
        name: 'name',
        label: 'Service',
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
      downloadFilename: kebabCase(`${selectedUser.username}-services.csv`)
    }),
    [selectedUser.username]
  );

  const handleDeleteButtonClick = () =>
    dispatch(setRemovingUserFromAllServicesConfirmationModalOpen(true));

  return (
    <Section
      title='Services'
      subtitle={serviceCount ? <Subtitle serviceCount={serviceCount} /> : null}
    >
      <Table
        columns={columns}
        data={services.map(
          ({ service: { id: serviceId, name }, role, createdAt }) => ({
            serviceId,
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
        disabled={!services.length}
      >
        Remove user from all services
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

export default UserServicesSection;
