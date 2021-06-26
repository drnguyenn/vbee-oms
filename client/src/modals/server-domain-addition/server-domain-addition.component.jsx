import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { findLastKey, uniq } from 'lodash';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  makeStyles,
  OutlinedInput,
  InputAdornment,
  Tooltip
} from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';

import { setServerDomainAdditionModalOpen } from '../../redux/modal/modal.actions';
import { addServerDomainStart } from '../../redux/server/server.actions';

const useStyles = makeStyles({
  addDomainButton: {
    float: 'right'
  }
});

const ServerDomainAdditionModal = () => {
  const classes = useStyles();

  const [domains, setDomains] = useState({ domain1: '' });

  const { openServerDomainAdditionModal } = useSelector(state => state.modal);

  const { currentServer, isAddingDomains } = useSelector(state => state.server);

  const dispatch = useDispatch();

  const handleClose = () => dispatch(setServerDomainAdditionModalOpen(false));

  const handleDomainsChange = event => {
    const { name, value } = event.target;
    setDomains({ ...domains, [name]: value });
  };

  const handleAddDomainField = () => {
    const newDomainId = `domain${
      parseInt(findLastKey(domains, {}).substring(6), 10) + 1
    }`;

    setDomains({ ...domains, [newDomainId]: '' });
  };

  const handleRemoveDomainField = id => () => {
    const { [id]: domainId, ...rest } = domains;

    setDomains({ ...rest });
  };

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

          {Object.entries(domains).map(([key, value], index) => (
            <Fade key={key} in timeout={500}>
              <FormControl variant='outlined' margin='normal' fullWidth>
                <InputLabel htmlFor={key}>Domain {key.substring(6)}</InputLabel>
                <OutlinedInput
                  required
                  id={key}
                  autoComplete='off'
                  autoFocus
                  name={key}
                  type='text'
                  value={value}
                  onChange={handleDomainsChange}
                  disabled={isAddingDomains}
                  placeholder='www.some-domain.com'
                  label={`Domain ${key.substring(6)}`}
                  endAdornment={
                    index > 0 ? (
                      <InputAdornment position='end'>
                        <Tooltip title='Remove domain' arrow placement='left'>
                          <IconButton
                            onClick={handleRemoveDomainField(key)}
                            edge='end'
                          >
                            <Remove />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ) : (
                      <div />
                    )
                  }
                />
              </FormControl>
            </Fade>
          ))}
          <Tooltip
            className={classes.addDomainButton}
            title='Add more domain'
            arrow
            placement='left'
          >
            <IconButton onClick={handleAddDomainField} color='primary'>
              <Add />
            </IconButton>
          </Tooltip>
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
