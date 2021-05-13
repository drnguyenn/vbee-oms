import { useState } from 'react';
import { useSelector } from 'react-redux';
import { startCase } from 'lodash';

import { TextField, Fab, Backdrop, CircularProgress } from '@material-ui/core';

// import { updateProfileStart } from '../../redux/user/user.actions';

import {
  ProfileInputFormStyles,
  ButtonsGroupContainer
} from './profile-input-form.styles';

const ProfileInputForm = () => {
  const { currentUser, isUpdatingProfile } = useSelector(state => state.user);

  // const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState(currentUser);

  const {
    email,
    username,
    fullName,
    githubId,
    githubUsername,
    role
  } = userInfo;

  const handleSubmit = async event => {
    event.preventDefault();

    // const newUserInfo = { name: username };

    // dispatch(updateProfileStart(newUserInfo));
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  return (
    <ProfileInputFormStyles>
      <form onSubmit={handleSubmit}>
        <Backdrop
          open={isUpdatingProfile}
          style={{ position: 'absolute', zIndex: 1 }}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
        <TextField
          disabled
          name='email'
          type='text'
          value={email}
          label='Email'
          margin='normal'
          variant='outlined'
          fullWidth
        />
        <TextField
          disabled
          name='username'
          type='text'
          value={username}
          label='Username'
          margin='normal'
          variant='outlined'
          fullWidth
        />
        <TextField
          disabled
          name='role'
          type='text'
          value={startCase(role)}
          label='Role'
          margin='normal'
          variant='outlined'
          fullWidth
        />
        <TextField
          name='fullName'
          type='text'
          value={fullName}
          onChange={handleChange}
          label='Full name'
          margin='normal'
          variant='outlined'
          fullWidth
        />
        <TextField
          name='githubId'
          type='text'
          value={githubId}
          onChange={handleChange}
          label='GitHub ID'
          margin='normal'
          variant='outlined'
          fullWidth
        />
        <TextField
          name='githubUsername'
          type='text'
          value={githubUsername}
          onChange={handleChange}
          label='GitHub username'
          margin='normal'
          variant='outlined'
          fullWidth
        />

        <ButtonsGroupContainer>
          <Fab
            variant='extended'
            color='primary'
            type='submit'
            disabled={isUpdatingProfile}
          >
            Save
          </Fab>
        </ButtonsGroupContainer>
      </form>
    </ProfileInputFormStyles>
  );
};

export default ProfileInputForm;
