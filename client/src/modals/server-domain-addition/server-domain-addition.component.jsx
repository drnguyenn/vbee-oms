import { useDispatch, useSelector } from 'react-redux';
import { uniq } from 'lodash';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';

import { setServerDomainAdditionModalOpen } from 'redux/modal/modal.actions';
import { addServerDomainStart } from 'redux/server/server.actions';

import InputGroup, {
  useInputGroup
} from 'components/input-group/input-group.component';

const ServerDomainAdditionModal = () => {
  const [domains, handlers] = useInputGroup();

  const { openServerDomainAdditionModal } = useSelector(state => state.modal);

  const { currentServer, isAddingDomains } = useSelector(state => state.server);

  const dispatch = useDispatch();

  const handleClose = () => dispatch(setServerDomainAdditionModalOpen(false));

  const handleSubmit = async event => {
    event.preventDefault();

    dispatch(
      addServerDomainStart(
        currentServer.id,
        uniq(Object.values(domains).filter(domain => domain.length))
      )
    );
  };

  return (
    <Dialog
      open={openServerDomainAdditionModal}
      onClose={handleClose}
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add new domains</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add new domains that associate with the IP{' '}
            <b>{currentServer.ipAddress}</b>
          </DialogContentText>
          <InputGroup
            required
            autoFocus
            inputs={domains}
            inputLabel='Domain'
            placeholder='www.some-domain.com'
            disabled={isAddingDomains}
            addButtonTitle='Add more domain'
            removeButtonTitle='Remove domain'
            {...handlers}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            variant='outlined'
            disabled={isAddingDomains}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={isAddingDomains}
          >
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ServerDomainAdditionModal;
