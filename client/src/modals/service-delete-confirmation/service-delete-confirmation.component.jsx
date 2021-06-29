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

import { setServiceDeleteConfirmationModalOpen } from '../../redux/modal/modal.actions';
import { deleteServiceStart } from '../../redux/service/service.actions';

import Spinner from '../../components/spinner/spinner.component';

import ROUTE_PATHS from '../../router/route-paths';

const useStyles = makeStyles({
  typography: {
    marginTop: '0.35rem'
  },
  spinner: {
    position: 'absolute',
    zIndex: 1301
  }
});

const ServiceDeleteConfirmationModal = () => {
  const classes = useStyles();

  const [checkedState, setCheckedState] = useState({
    checkedRepoAssociationsRemove: false,
    checkedMembersRemove: false
  });
  const { checkedRepoAssociationsRemove, checkedMembersRemove } = checkedState;

  const [serviceName, setServiceName] = useState('');

  const { openServiceDeleteConfirmationModal } = useSelector(
    state => state.modal
  );

  const { currentService, isProcessing } = useSelector(state => state.service);

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    if (!currentService) history.push(ROUTE_PATHS.SERVICES);
  }, [currentService, history]);

  const handleClose = () =>
    dispatch(setServiceDeleteConfirmationModalOpen(false));

  const handleCheck = event => {
    const { name: checkboxName, checked } = event.target;

    setCheckedState({ ...checkedState, [checkboxName]: checked });
  };

  const handleChange = event => setServiceName(event.target.value);

  const handleSubmit = async event => {
    event.preventDefault();

    if (currentService.id) dispatch(deleteServiceStart(currentService.id));
  };

  if (currentService)
    return (
      <Dialog open={openServiceDeleteConfirmationModal} onClose={handleClose}>
        <Spinner open={isProcessing} backdropClasses={classes.spinner} />
        <DialogTitle>Delete service</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Typography gutterBottom>
              By deleting this service, you agree to:
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedRepoAssociationsRemove}
                    onChange={handleCheck}
                    name='checkedRepoAssociationsRemove'
                  />
                }
                label='Remove all repository associations'
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
                label='Remove all member associations'
                disabled={isProcessing}
              />
            </FormGroup>

            <Typography className={classes.typography}>
              This action is <b>permanent</b> and <b>cannot</b> be undone, are
              you absolutely sure ?
              <br />
              Please type <b>{currentService.name}</b> to confirm.
            </Typography>

            <TextField
              required
              autoComplete='off'
              name='name'
              type='text'
              value={serviceName}
              onChange={handleChange}
              label='Confirm service name'
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
                !checkedRepoAssociationsRemove ||
                !checkedMembersRemove ||
                currentService.name !== serviceName
              }
            >
              Delete service
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );

  return null;
};

export default ServiceDeleteConfirmationModal;
