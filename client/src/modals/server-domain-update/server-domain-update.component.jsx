import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions
} from '@material-ui/core';

import { toggleServerDomainUpdateModal } from '../../redux/modal/modal.actions';

import { updateServerDomainStart } from '../../redux/server/server.actions';

const ServerDomainUpdateModal = () => {
  const { openServerDomainUpdateModal } = useSelector(state => state.modal);

  const { currentDomain, isUpdatingDomains } = useSelector(
    state => state.server
  );

  const [value, setValue] = useState(currentDomain.value);

  const dispatch = useDispatch();

  const handleClose = () => dispatch(toggleServerDomainUpdateModal());

  const handleChange = event => setValue(event.target.value);

  const handleSubmit = event => {
    event.preventDefault();

    if (currentDomain)
      dispatch(updateServerDomainStart(currentDomain.id, { value }));
  };

  return (
    <Dialog open={openServerDomainUpdateModal} onClose={handleClose} fullWidth>
      <DialogTitle>Update domain</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            required
            autoComplete='off'
            autoFocus
            name='domain'
            type='text'
            value={value}
            onChange={handleChange}
            disabled={isUpdatingDomains}
            label='Domain'
            placeholder='www.some-domain.com'
            margin='normal'
            variant='outlined'
            fullWidth
          />

          <DialogActions>
            <Button
              onClick={handleClose}
              variant='outlined'
              disabled={isUpdatingDomains}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              disabled={isUpdatingDomains}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServerDomainUpdateModal;
