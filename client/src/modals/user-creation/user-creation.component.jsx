import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';

import {
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  InputLabel,
  Select,
  FormControl,
  LinearProgress,
  MenuItem,
  Grid,
  makeStyles
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import { setUserCreationModalOpen } from 'redux/modal/modal.actions';
import { createUserStart } from 'redux/user/user.actions';
import { useAutocompleteLogic } from 'hooks/autocomplete.hooks';
import { searchUsers } from 'services/user.service';

import { DEBOUNCE_SEARCH_WAIT_TIME } from 'constants/index';

const useStyles = makeStyles({
  linearProgress: {
    position: 'absolute',
    width: '100%',
    borderRadius: '8px 8px 0 0'
  }
});

const handleSearch = debounce(async (query = {}, callback = () => {}) => {
  const users = await searchUsers(query, {
    vbeeSearch: false,
    githubSearch: true
  });

  callback(users);
}, DEBOUNCE_SEARCH_WAIT_TIME);

const UserCreationModal = () => {
  const classes = useStyles();

  const [userInfo, setUserInfo] = useState({
    email: '',
    username: '',
    fullName: '',
    githubUsername: '',
    role: 'member'
  });
  const { email, username, fullName, role } = userInfo;

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
    'githubUsername'
  );

  const { openUserCreationModal } = useSelector(state => state.modal);
  const { isProcessing } = useSelector(state => state.user);

  const dispatch = useDispatch();

  const handleClose = () => dispatch(setUserCreationModalOpen(false));

  const handleChange = event => {
    const { name: elementName, value: elementValue } = event.target;
    setUserInfo({ ...userInfo, [elementName]: elementValue });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (value)
      dispatch(
        createUserStart({
          ...userInfo,
          githubUsername: value.githubUsername
        })
      );
  };

  return (
    <Dialog open={openUserCreationModal} onClose={handleClose}>
      {isProcessing && <LinearProgress className={classes.linearProgress} />}

      <DialogTitle>Create new user account</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            required
            autoFocus
            autoComplete='off'
            name='email'
            type='email'
            value={email}
            onChange={handleChange}
            disabled={isProcessing}
            label='Email'
            margin='normal'
            variant='outlined'
            fullWidth
          />
          <TextField
            required
            autoComplete='off'
            name='username'
            type='text'
            value={username}
            onChange={handleChange}
            disabled={isProcessing}
            label='Username'
            margin='normal'
            variant='outlined'
            fullWidth
          />
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
            options={options}
            noOptionsText='No matching results found'
            loading={isSearching && !options.length}
            loadingText='Searching...'
            renderInput={params => (
              <TextField
                {...params}
                required
                disabled={isProcessing}
                label='Choose a GitHub user'
                placeholder='Search by GitHub username, full name, or email'
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
                </Grid>
              </Grid>
            )}
          />
          <TextField
            autoComplete='off'
            name='fullName'
            type='text'
            value={fullName}
            onChange={handleChange}
            disabled={isProcessing}
            label='Full name'
            margin='normal'
            variant='outlined'
            fullWidth
          />
          <FormControl variant='outlined' required fullWidth margin='normal'>
            <InputLabel>Role</InputLabel>
            <Select
              name='role'
              value={role}
              onChange={handleChange}
              label='Role'
              disabled={isProcessing}
            >
              <MenuItem value='member'>Member</MenuItem>
              <MenuItem value='admin'>Admin</MenuItem>
            </Select>
          </FormControl>
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
            color='primary'
            disabled={isProcessing}
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserCreationModal;
