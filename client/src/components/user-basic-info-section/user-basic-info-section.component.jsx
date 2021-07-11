import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';

import {
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  TextField,
  Fade,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  makeStyles
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Close, Check, Edit } from '@material-ui/icons';

import { searchUsers } from 'services/user.service';

import { updateUserStart } from 'redux/user/user.actions';

import Section from 'components/section/section.component';

import {
  SectionRowStyles,
  SectionRowTitleStyles,
  SectionRowValueStyles
} from 'components/section/section.styles';

import { DEBOUNCE_SEARCH_WAIT_TIME } from 'constants/index';
import { useAutocompleteLogic } from 'hooks/autocomplete.hooks';

const useStyles = makeStyles({
  textField: {
    width: '70%'
  },
  avatar: {
    width: '5rem',
    height: '5rem'
  }
});

const handleSearch = debounce(async (query = {}, callback = () => {}) => {
  const users = await searchUsers(query, {
    vbeeSearch: false,
    githubSearch: true
  });

  callback(users);
}, DEBOUNCE_SEARCH_WAIT_TIME);

const UserBasicInfoSection = () => {
  const classes = useStyles();

  const { selectedUser, isUpdatingInfo } = useSelector(state => state.user);

  const [editMode, setEditMode] = useState(false);

  const [userInfo, setUserInfo] = useState({
    email: '',
    username: '',
    role: 'member'
  });
  const { email, username, role } = userInfo;

  const {
    options,
    value,
    inputValue,
    isSearching,
    handleValueChange,
    handleInputChange,
    setValue,
    setInputValue
  } = useAutocompleteLogic(
    handleSearch,
    'q',
    'githubUsername',
    'githubUsername'
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedUser && !isUpdatingInfo)
      setUserInfo({
        email: selectedUser.email || '',
        username: selectedUser.username || '',
        role: selectedUser.role || 'member'
      });

    setValue({ githubUsername: selectedUser.githubUsername });
    setInputValue(selectedUser.githubUsername);
  }, [selectedUser, isUpdatingInfo, setInputValue, setValue]);

  const handleEditClick = () => setEditMode(true);

  const handleCancelClick = () => {
    setUserInfo({
      email: selectedUser.email || '',
      username: selectedUser.username || '',
      role: selectedUser.role || 'member'
    });
    setEditMode(false);
  };

  const handleChange = event => {
    const { name: elementName, value: elementValue } = event.target;
    setUserInfo({ ...userInfo, [elementName]: elementValue });
  };

  const handleSubmit = event => {
    event.preventDefault();

    dispatch(updateUserStart(selectedUser.id, userInfo));

    setEditMode(false);
  };

  const HeaderOptions = () => {
    if (editMode)
      return (
        <div>
          <Tooltip title='Cancel' arrow>
            <IconButton onClick={handleCancelClick}>
              <Close />
            </IconButton>
          </Tooltip>
          {email.length ? (
            <Tooltip title='Save' arrow>
              <IconButton onClick={handleSubmit}>
                <Check />
              </IconButton>
            </Tooltip>
          ) : (
            <IconButton disabled>
              <Check />
            </IconButton>
          )}
        </div>
      );

    return isUpdatingInfo ? (
      <CircularProgress size={20} />
    ) : (
      <Tooltip title='Edit' arrow>
        <IconButton onClick={handleEditClick}>
          <Edit />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <Section title='Basic info' headerOptions={<HeaderOptions />}>
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <SectionRowStyles>
            <SectionRowTitleStyles>Email</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <TextField
                required
                className={classes.textField}
                autoComplete='off'
                autoFocus
                name='email'
                type='email'
                value={email}
                onChange={handleChange}
                label='Email'
                variant='outlined'
              />
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Username</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <TextField
                required
                className={classes.textField}
                autoComplete='off'
                name='username'
                type='text'
                value={username}
                onChange={handleChange}
                label='Username'
                variant='outlined'
              />
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>GitHub username</SectionRowTitleStyles>
            <Autocomplete
              className={classes.textField}
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
                    <Avatar
                      src={option.avatarUrl}
                      alt={option.githubUsername}
                    />
                  </Grid>
                  <Grid item xs>
                    {`${option.githubUsername}`}
                  </Grid>
                </Grid>
              )}
            />
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Role</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <FormControl
                className={classes.textField}
                required
                variant='outlined'
              >
                <InputLabel>Role</InputLabel>
                <Select
                  name='role'
                  value={role}
                  onChange={handleChange}
                  label='Role'
                >
                  <MenuItem value='member'>Member</MenuItem>
                  <MenuItem value='admin'>Admin</MenuItem>
                </Select>
              </FormControl>
            </Fade>
          </SectionRowStyles>
          <input type='submit' hidden />
        </form>
      ) : (
        <>
          <SectionRowStyles>
            <SectionRowTitleStyles>Avatar</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>
                <Avatar
                  className={classes.avatar}
                  src={selectedUser.avatarUrl}
                  alt={selectedUser.username}
                />
              </SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>ID</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>{selectedUser.id}</SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Email</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {email}
                  </a>
                ) : (
                  <em>No email provided</em>
                )}
              </SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Username</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>
                {username || <em>No username provided</em>}
              </SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>GitHub ID</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>
                {selectedUser.githubId}
              </SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>GitHub username</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>
                {value && (
                  <a
                    href={`https://github.com/${value.githubUsername}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {value.githubUsername}
                  </a>
                )}
              </SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Full name</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>
                {selectedUser.fullName || <em>No full name provided</em>}
              </SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
        </>
      )}
    </Section>
  );
};

export default UserBasicInfoSection;
