import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Menu, MenuItem, Avatar, IconButton } from '@material-ui/core';

import { signOutStart } from '../../redux/user/user.actions';

import ROUTE_PATHS from '../../router/route-paths';

const AvatarDropdown = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { currentUser } = useSelector(state => state.user);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDirect = path => () => {
    history.push(path);
    handleClose();
  };

  const handleSignout = () => dispatch(signOutStart());

  return (
    <>
      <IconButton onClick={handleMenu} size='small'>
        {currentUser && (
          <Avatar src={currentUser.avatarUrl} alt={currentUser.username} />
        )}
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
        <MenuItem onClick={handleDirect(ROUTE_PATHS.PROFILE)}>
          {currentUser.username}
        </MenuItem>
        <MenuItem onClick={handleSignout}>Sign out</MenuItem>
      </Menu>
    </>
  );
};

export default AvatarDropdown;
