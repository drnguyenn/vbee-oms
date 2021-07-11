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

import { setRepositoryMemberAdditionModalOpen } from 'redux/modal/modal.actions';
import { addRepositoryMemberFromGitHubStart } from 'redux/repository/repository.actions';

import { useAutocompleteLogic } from 'hooks/autocomplete.hooks';

import { DEBOUNCE_SEARCH_WAIT_TIME } from 'constants/index';

const useStyles = makeStyles({
  additionalStatus: {
    fontStyle: 'italic'
  }
});

const handleSearch = debounce(async (query = {}, callback = () => {}) => {
  const users = await searchUsers(query, { githubSearch: true });

  callback(users);
}, DEBOUNCE_SEARCH_WAIT_TIME);

const RepositoryMemberAdditionModal = () => {
  const classes = useStyles();

  const { isAddingMembers, currentRepository } = useSelector(
    state => state.repository
  );

  const preprocessResults = useCallback(
    results => {
      const userIds = currentRepository.members.map(
        ({ user: { githubUsername } }) => githubUsername
      );

      return results.map(result =>
        userIds.includes(result.githubUsername)
          ? { ...result, isAdded: true }
          : { ...result, isAdded: false }
      );
    },
    [currentRepository.members]
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
    'githubUsername',
    'githubUsername',
    preprocessResults
  );

  const [permission, setPermission] = useState('write');

  const { openRepositoryMemberAdditionModal } = useSelector(
    state => state.modal
  );

  const dispatch = useDispatch();

  const handleClose = () =>
    dispatch(setRepositoryMemberAdditionModalOpen(false));

  const handleChange = event => {
    setPermission(event.target.value);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (currentRepository && value)
      dispatch(
        addRepositoryMemberFromGitHubStart(
          currentRepository.id,
          value.githubUsername,
          { permission }
        )
      );
  };

  return (
    <Dialog
      open={openRepositoryMemberAdditionModal}
      onClose={handleClose}
      fullWidth
    >
      <DialogTitle>Add new member to repository</DialogTitle>
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
            getOptionLabel={option => option.githubUsername}
            getOptionDisabled={option => option.isAdded}
            groupBy={({ source }) => source}
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
                  <Avatar src={option.avatarUrl} alt={option.githubUsername} />
                </Grid>
                <Grid item xs>
                  {`${option.githubUsername}`}
                  {option.source === 'Vbee OMS' && (
                    <Typography variant='body2' color='textSecondary'>
                      {option.fullName}
                    </Typography>
                  )}
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
            <FormLabel>Permission</FormLabel>
            <RadioGroup value={permission} onChange={handleChange}>
              <FormControlLabel
                value='read'
                control={<Radio color='primary' />}
                label='Read'
              />
              <FormControlLabel
                value='write'
                control={<Radio color='primary' />}
                label='Write'
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

export default RepositoryMemberAdditionModal;
