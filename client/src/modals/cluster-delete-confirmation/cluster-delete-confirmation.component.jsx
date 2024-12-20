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

import { setClusterDeleteConfirmationModalOpen } from '../../redux/modal/modal.actions';
import { deleteClusterStart } from '../../redux/cluster/cluster.actions';

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

const ClusterDeleteConfirmationModal = () => {
  const classes = useStyles();

  const [checkedState, setCheckedState] = useState({
    checkedServersAndServicesDelete: false,
    checkedRepoAssociationsRemove: false,
    checkedMembersRemove: false
  });
  const {
    checkedServersAndServicesDelete,
    checkedRepoAssociationsRemove,
    checkedMembersRemove
  } = checkedState;

  const [clusterName, setClusterName] = useState('');

  const { openClusterDeleteConfirmationModal } = useSelector(
    state => state.modal
  );

  const { currentCluster, isProcessing } = useSelector(state => state.cluster);

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    if (!currentCluster) history.push(ROUTE_PATHS.CLUSTERS);
  }, [currentCluster, history]);

  const handleClose = () =>
    dispatch(setClusterDeleteConfirmationModalOpen(false));

  const handleCheck = event => {
    const { name: checkboxName, checked } = event.target;

    setCheckedState({ ...checkedState, [checkboxName]: checked });
  };

  const handleChange = event => setClusterName(event.target.value);

  const handleSubmit = async event => {
    event.preventDefault();

    if (currentCluster.id) dispatch(deleteClusterStart(currentCluster.id));
  };

  if (currentCluster)
    return (
      <Dialog open={openClusterDeleteConfirmationModal} onClose={handleClose}>
        <Spinner open={isProcessing} backdropClasses={classes.spinner} />

        <DialogTitle>Delete cluster</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Typography gutterBottom>
              By deleting this cluster, you agree to:
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedServersAndServicesDelete}
                    onChange={handleCheck}
                    name='checkedServersAndServicesDelete'
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
                label='Remove all member associations'
                disabled={isProcessing}
              />
            </FormGroup>

            <Typography className={classes.typography}>
              This action is <b>permanent</b> and <b>cannot</b> be undone, are
              you absolutely sure ?
              <br />
              Please type <b>{currentCluster.name}</b> to confirm.
            </Typography>

            <TextField
              required
              autoComplete='off'
              name='name'
              type='text'
              value={clusterName}
              onChange={handleChange}
              label='Confirm cluster name'
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
                !checkedServersAndServicesDelete ||
                !checkedRepoAssociationsRemove ||
                !checkedMembersRemove ||
                currentCluster.name !== clusterName
              }
            >
              Delete cluster
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );

  return null;
};

export default ClusterDeleteConfirmationModal;
