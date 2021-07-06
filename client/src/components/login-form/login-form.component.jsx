import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  CircularProgress,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Fab,
  OutlinedInput,
  TextField,
  makeStyles
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

import { emailSignInStart } from 'redux/auth/auth.actions';

import { LoginFormStyles, ActionStyles } from './login-form.styles';

const useStyles = makeStyles(theme => ({
  fab: {
    margin: '12px 12px 12px 0',
    color: theme.palette.grey[900]
  }
}));

const LoginForm = () => {
  const classes = useStyles();

  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: ''
  });
  const { email, password } = userCredentials;

  const [showPassword, setShowPassword] = useState(false);

  const { isProcessing } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const handleChange = event => {
    const { name, value } = event.target;

    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleSubmit = async event => {
    event.preventDefault();

    dispatch(emailSignInStart(email, password));
  };

  return (
    <LoginFormStyles onSubmit={handleSubmit}>
      <TextField
        required
        name='email'
        type='email'
        value={email}
        onChange={handleChange}
        disabled={isProcessing}
        label='Email'
        variant='outlined'
        fullWidth
        margin='normal'
      />
      <FormControl variant='outlined' margin='normal' fullWidth>
        <InputLabel htmlFor='password'>Password</InputLabel>
        <OutlinedInput
          required
          id='password'
          name='password'
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handleChange}
          disabled={isProcessing}
          label='Password'
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                onClick={handleShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge='end'
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <ActionStyles>
        <Fab
          className={classes.fab}
          variant='extended'
          color='primary'
          type='submit'
          disabled={isProcessing}
        >
          Log in
        </Fab>
        {isProcessing && <CircularProgress size={20} />}
      </ActionStyles>
    </LoginFormStyles>
  );
};

export default LoginForm;
