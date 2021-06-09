import { useEffect, useState } from 'react';
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

import { searchUsers } from '../../services/user.service';

import { toggleServiceMemberAdditionModal } from '../../redux/modal/modal.actions';
import { addServiceMemberStart } from '../../redux/service/service.actions';

import { DEBOUNCE_SEARCH_WAIT_TIME } from '../../constants';

const useStyles = makeStyles({
  additionStatus: {
    fontStyle: 'italic'
  }
});

const handleSearch = debounce(async (searchText = '', callback = () => {}) => {
  if (searchText) {
    const users = await searchUsers(`?q=${searchText}`);

    callback(users);
  }
}, DEBOUNCE_SEARCH_WAIT_TIME);

const ServiceMemberAdditionModal = () => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [role, setRole] = useState('member');

  const { openServiceMemberAdditionModal } = useSelector(state => state.modal);
  const { isAddingMembers, currentService } = useSelector(
    state => state.service
  );

  const dispatch = useDispatch();

  const handleClose = () => dispatch(toggleServiceMemberAdditionModal());

  const handleChange = event => {
    setRole(event.target.value);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    dispatch(addServiceMemberStart(currentService.id, value.id, { role }));
  };

  const handleValueChange = (event, newValue) => {
    // setOptions(newValue ? [newValue, ...options] : options);
    setValue(newValue);
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  useEffect(() => {
    if (!inputValue) setOptions(value ? [value] : []);
    else if (!value || inputValue !== value.username) {
      setIsSearching(true);

      handleSearch(inputValue, results => {
        let newOptions = [];

        if (results.length)
          newOptions = results.map(result =>
            currentService.members
              .map(({ user: { id } }) => id)
              .includes(result.id)
              ? { ...result, isAdded: true }
              : { ...result, isAdded: false }
          );

        setOptions(
          value && !newOptions.includes(value)
            ? [...newOptions, value]
            : newOptions
        );

        setIsSearching(false);
      });
    }
  }, [inputValue, value, currentService.members]);

  return (
    <Dialog
      open={openServiceMemberAdditionModal}
      onClose={handleClose}
      fullWidth
    >
      <DialogTitle>Add new member to service</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Autocomplete
            fullWidth
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => {
              setOpen(false);
              setIsSearching(false);
            }}
            value={value}
            inputValue={inputValue}
            onChange={handleValueChange}
            onInputChange={handleInputChange}
            filterOptions={option => option}
            // filterSelectedOptions
            includeInputInList
            getOptionSelected={(option, selectedValue) =>
              option.id === selectedValue.id
            }
            getOptionLabel={option => option.username}
            getOptionDisabled={option => option.isAdded}
            options={options}
            noOptionsText='No matching results found'
            loading={open && isSearching && options.length === 0}
            loadingText='Searching...'
            renderInput={params => (
              <TextField
                {...params}
                required
                autoFocus
                label='Choose a member'
                placeholder="Enter member's username, full name or GitHub username, etc."
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
                  {option.fullName}
                  <Typography variant='body2' color='textSecondary'>
                    {`@${option.username}`}
                  </Typography>
                </Grid>
                <Grid>
                  {option.isAdded && (
                    <Typography className={classes.additionStatus}>
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

export default ServiceMemberAdditionModal;
