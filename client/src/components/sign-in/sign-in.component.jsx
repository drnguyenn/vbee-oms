import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  TextField,
  Fab,
  CircularProgress,
  makeStyles
} from '@material-ui/core';

import { emailSignInStart } from '../../redux/user/user.actions';

import { SignInStyles, ActionStyles } from './sign-in.styles';

const useStyles = makeStyles(theme => ({
  primary: {
    color: theme.palette.grey[900]
  }
}));

const SignIn = () => {
  const classes = useStyles();

  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: ''
  });
  const { email, password } = userCredentials;

  const { isProcessing } = useSelector(state => state.user);

  const dispatch = useDispatch();

  const handleSubmit = async event => {
    event.preventDefault();

    dispatch(emailSignInStart(email, password));
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  return (
    <SignInStyles>
      <form onSubmit={handleSubmit}>
        <TextField
          name='email'
          type='email'
          value={email}
          onChange={handleChange}
          label='Email'
          variant='outlined'
          fullWidth
          margin='normal'
          required
        />
        <TextField
          name='password'
          type='password'
          value={password}
          onChange={handleChange}
          label='Password'
          variant='outlined'
          fullWidth
          margin='normal'
          required
        />

        <ActionStyles>
          <Fab
            className={classes.primary}
            variant='extended'
            color='primary'
            type='submit'
            style={{ margin: '12px 0' }}
            disabled={isProcessing}
          >
            Log in
          </Fab>
          {isProcessing && <CircularProgress size={25} />}
        </ActionStyles>
      </form>
    </SignInStyles>
  );
};

export default SignIn;
