import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  makeStyles
} from '@material-ui/core';

import { setRemovingUserFromAllReposConfirmationModalOpen } from 'redux/modal/modal.actions';
import { removeUserFromAllRepositoriesStart } from 'redux/user/user.actions';

import Spinner from 'components/spinner/spinner.component';

const useStyles = makeStyles({
  typography: {
    marginTop: '0.35rem'
  },
  spinner: {
    position: 'absolute',
    zIndex: 1301
  },
  list: {
    listStyle: 'none',
    fontSize: 'initial',
    margin: 0,
    padding: 0
  },
  listItem: {
    display: 'inline',
    '&:not(:last-child):after': {
      content: '", "'
    }
  }
});

const RemovingUserFromAllReposConfirmationModal = () => {
  const classes = useStyles();

  const [confirmUsername, setConfirmUserName] = useState('');

  const { openRemovingUserFromAllReposConfirmationModal } = useSelector(
    state => state.modal
  );

  const { selectedUser, isProcessing } = useSelector(state => state.user);
  const { id, username, repositories } = selectedUser;

  const dispatch = useDispatch();

  const handleClose = () =>
    dispatch(setRemovingUserFromAllReposConfirmationModalOpen(false));

  const handleChange = event => setConfirmUserName(event.target.value);

  const handleSubmit = async event => {
    event.preventDefault();

    if (selectedUser.id) dispatch(removeUserFromAllRepositoriesStart(id));
  };

  if (selectedUser)
    return (
      <Dialog
        open={openRemovingUserFromAllReposConfirmationModal}
        onClose={handleClose}
      >
        <Spinner open={isProcessing} backdropClasses={classes.spinner} />

        <DialogTitle>Remove user from all repositories</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Typography gutterBottom>
              Once removed, <b>{username}</b> will no longer have access to the
              following repositories:
            </Typography>

            <ul className={classes.list}>
              {repositories.map(
                ({ repository: { id: repositoryId, name } }) => (
                  <li key={repositoryId} className={classes.listItem}>
                    <b>{name}</b>
                  </li>
                )
              )}
            </ul>

            <Typography className={classes.typography}>
              Are you absolutely sure ? Please type <b>{username}</b> to
              confirm.
            </Typography>

            <TextField
              required
              autoComplete='off'
              name='name'
              type='text'
              value={confirmUsername}
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
              disabled={isProcessing || username !== confirmUsername}
            >
              Remove
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );

  return null;
};

export default RemovingUserFromAllReposConfirmationModal;
