import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';

import {
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Grid,
  Typography,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  makeStyles
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import { searchUsers } from 'services/user.service';

import { setClusterMemberAdditionModalOpen } from 'redux/modal/modal.actions';
import { addClusterMemberStart } from 'redux/cluster/cluster.actions';

import { useAutocompleteLogic } from 'hooks/autocomplete.hooks';

import { DEBOUNCE_SEARCH_WAIT_TIME } from 'constants/index';

const useStyles = makeStyles({
  additionalStatus: {
    fontStyle: 'italic'
  }
});

const handleSearch = debounce(async (query = {}, callback = () => {}) => {
  const users = await searchUsers(query);

  callback(users);
}, DEBOUNCE_SEARCH_WAIT_TIME);

const ClusterMemberAdditionModal = () => {
  const classes = useStyles();

  const { isAddingMembers, currentCluster } = useSelector(
    state => state.cluster
  );

  const preprocessResults = useCallback(
    results => {
      const userIds = currentCluster.members.map(({ user: { id } }) => id);

      return results.map(result =>
        userIds.includes(result.id)
          ? { ...result, isAdded: true }
          : { ...result, isAdded: false }
      );
    },
    [currentCluster.members]
  );

  const {
    options,
    value,
    inputValue,
    isSearching,
    handleValueChange,
    handleInputChange
  } = useAutocompleteLogic(
    handleSearch,
    'q',
    'username',
    'id',
    preprocessResults
  );

  const [role, setRole] = useState('member');

  const { openClusterMemberAdditionModal } = useSelector(state => state.modal);

  const dispatch = useDispatch();

  const handleClose = () => dispatch(setClusterMemberAdditionModalOpen(false));

  const handleChange = event => {
    setRole(event.target.value);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (currentCluster && value)
      dispatch(addClusterMemberStart(currentCluster.id, value.id, { role }));
  };

  return (
    <Dialog
      open={openClusterMemberAdditionModal}
      onClose={handleClose}
      fullWidth
    >
      <DialogTitle>Add new member to cluster</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Autocomplete
            fullWidth
            value={value}
            inputValue={inputValue}
            onChange={handleValueChange}
            onInputChange={handleInputChange}
            filterOptions={option => option}
            includeInputInList
            getOptionSelected={(option, selectedValue) =>
              option.id === selectedValue.id
            }
            getOptionLabel={option => option.username}
            getOptionDisabled={option => option.isAdded}
            options={options}
            noOptionsText='No matching results found'
            loading={isSearching && !options.length}
            loadingText='Searching...'
            renderInput={params => (
              <TextField
                {...params}
                required
                autoFocus
                label='Choose a user'
                placeholder='Search by username, full name, GitHub username, email, etc.'
                margin='normal'
                variant='outlined'
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isSearching ? (
                        <CircularProgress color='inherit' size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
            renderOption={option => (
              <Grid container alignItems='center' spacing={2}>
                <Grid item>
                  <Avatar src={option.avatarUrl} alt={option.username} />
                </Grid>
                <Grid item xs>
                  {`${option.username}`}
                  <Typography variant='body2' color='textSecondary'>
                    {option.fullName}
                  </Typography>
                </Grid>
                <Grid>
                  {option.isAdded && (
                    <Typography className={classes.additionalStatus}>
                      Added
                    </Typography>
                  )}
                </Grid>
              </Grid>
            )}
          />

          <FormControl margin='normal'>
            <FormLabel>Role</FormLabel>
            <RadioGroup value={role} onChange={handleChange}>
              <FormControlLabel
                value='member'
                control={<Radio color='primary' />}
                label='Member'
              />
              <FormControlLabel
                value='admin'
                control={<Radio color='primary' />}
                label='Admin'
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            variant='outlined'
            disabled={isAddingMembers}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={isAddingMembers || !value}
          >
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ClusterMemberAdditionModal;
