import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  makeStyles
} from '@material-ui/core';

import { setUserDeleteConfirmationModalOpen } from 'redux/modal/modal.actions';
import { deleteUserStart } from 'redux/user/user.actions';

import Spinner from 'components/spinner/spinner.component';

import ROUTE_PATHS from 'router/route-paths';

const useStyles = makeStyles({
  typography: {
    marginTop: '0.35rem'
  },
  spinner: {
    position: 'absolute',
    zIndex: 1301
  }
});

const UserDeleteConfirmationModal = () => {
  const classes = useStyles();

  const [checkedState, setCheckedState] = useState({
    checkedRemoveFromAllClusters: false,
    checkedRemoveFromAllServices: false,
    checkedRemoveFromAllRepos: false,
    checkedRemoveAccessToSystem: false
  });
  const {
    checkedRemoveFromAllClusters,
    checkedRemoveFromAllServices,
    checkedRemoveFromAllRepos,
    checkedRemoveAccessToSystem
  } = checkedState;

  const [username, setUserName] = useState('');

  const { openUserDeleteConfirmationModal } = useSelector(state => state.modal);

  const { selectedUser, isProcessing } = useSelector(state => state.user);

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    if (!selectedUser) history.push(ROUTE_PATHS.USERS);
  }, [selectedUser, history]);

  const handleClose = () => dispatch(setUserDeleteConfirmationModalOpen(false));

  const handleCheck = event => {
    const { name: checkboxName, checked } = event.target;

    setCheckedState({ ...checkedState, [checkboxName]: checked });
  };

  const handleChange = event => setUserName(event.target.value);

  const handleSubmit = async event => {
    event.preventDefault();

    if (selectedUser.id) dispatch(deleteUserStart(selectedUser.id));
  };

  if (selectedUser)
    return (
      <Dialog open={openUserDeleteConfirmationModal} onClose={handleClose}>
        <Spinner open={isProcessing} backdropClasses={classes.spinner} />

        <DialogTitle>Delete user account</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Typography gutterBottom>
              By deleting this user account, you agree to:
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedRemoveFromAllClusters}
                    onChange={handleCheck}
                    name='checkedRemoveFromAllClusters'
                  />
                }
                label='Remove the user from all clusters he has joined'
                disabled={isProcessing}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedRemoveFromAllServices}
                    onChange={handleCheck}
                    name='checkedRemoveFromAllServices'
                  />
                }
                label='Remove the user from all services he has joined'
                disabled={isProcessing}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedRemoveFromAllRepos}
                    onChange={handleCheck}
                    name='checkedRemoveFromAllRepos'
                  />
                }
                label='Remove the user from all repositories he has joined'
                disabled={isProcessing}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedRemoveAccessToSystem}
                    onChange={handleCheck}
                    name='checkedRemoveAccessToSystem'
                  />
                }
                label='The user no longer has access to the system'
                disabled={isProcessing}
              />
            </FormGroup>

            <Typography className={classes.typography}>
              Are you absolutely sure ? Please type{' '}
              <b>{selectedUser.username}</b> to confirm.
            </Typography>

            <TextField
              required
              autoComplete='off'
              name='name'
              type='text'
              value={username}
              onChange={handleChange}
              label='Confirm user name'
              margin='normal'
              variant='outlined'
              fullWidth
            />
          </DialogContent>

          <DialogActions>
            <Button
              onClick={handleClose}
              variant='outlined'
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='contained'
              color='secondary'
              disabled={
                isProcessing ||
                !checkedRemoveFromAllClusters ||
                !checkedRemoveFromAllServices ||
                !checkedRemoveFromAllRepos ||
                !checkedRemoveAccessToSystem ||
                selectedUser.username !== username
              }
            >
              Delete user account
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );

  return null;
};

export default UserDeleteConfirmationModal;
