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

import { setServerDeleteConfirmationModalOpen } from 'redux/modal/modal.actions';
import { deleteServerStart } from 'redux/server/server.actions';

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

const ServerDeleteConfirmationModal = () => {
  const classes = useStyles();

  const [checkedState, setCheckedState] = useState({
    checkedServicesDelete: false,
    checkedRepoAssociationsRemove: false,
    checkedMembersRemove: false
  });
  const {
    checkedServicesDelete,
    checkedRepoAssociationsRemove,
    checkedMembersRemove
  } = checkedState;

  const [serverName, setServerName] = useState('');

  const { openServerDeleteConfirmationModal } = useSelector(
    state => state.modal
  );

  const { currentServer, isProcessing } = useSelector(state => state.server);

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    if (!currentServer) history.push(ROUTE_PATHS.SERVERS);
  }, [currentServer, history]);

  const handleClose = () =>
    dispatch(setServerDeleteConfirmationModalOpen(false));

  const handleCheck = event => {
    const { name: checkboxName, checked } = event.target;

    setCheckedState({ ...checkedState, [checkboxName]: checked });
  };

  const handleChange = event => setServerName(event.target.value);

  const handleSubmit = async event => {
    event.preventDefault();

    if (currentServer.id) dispatch(deleteServerStart(currentServer.id));
  };

  if (currentServer)
    return (
      <Dialog open={openServerDeleteConfirmationModal} onClose={handleClose}>
        <Spinner open={isProcessing} backdropClasses={classes.spinner} />

        <DialogTitle>Delete server</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Typography gutterBottom>
              By deleting this cluster, you agree to:
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedServicesDelete}
                    onChange={handleCheck}
                    name='checkedServicesDelete'
                  />
                }
                label='Delete all servers and services inside it'
                disabled={isProcessing}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedRepoAssociationsRemove}
                    onChange={handleCheck}
                    name='checkedRepoAssociationsRemove'
                  />
                }
                label='Delete all repository associations of the services mentioned above'
                disabled={isProcessing}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedMembersRemove}
                    onChange={handleCheck}
                    name='checkedMembersRemove'
                  />
                }
                label='Remove all member associations of the services mentioned above'
                disabled={isProcessing}
              />
            </FormGroup>

            <Typography className={classes.typography}>
              This action is <b>permanent</b> and <b>cannot</b> be undone, are
              you absolutely sure ?
              <br />
              Please type <b>{currentServer.name}</b> to confirm.
            </Typography>

            <TextField
              required
              autoComplete='off'
              name='name'
              type='text'
              value={serverName}
              onChange={handleChange}
              label='Confirm server name'
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
                !checkedServicesDelete ||
                !checkedRepoAssociationsRemove ||
                !checkedMembersRemove ||
                currentServer.name !== serverName
              }
            >
              Delete server
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );

  return null;
};

export default ServerDeleteConfirmationModal;
