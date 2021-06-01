import SignIn from '../../components/sign-in/sign-in.component';

import LoginImage from '../../assets/images/login-page.png';

import {
  LoginPageStyles,
  LoginImageContainer,
  SignInFormStyles
} from './log-in.styles';

const LoginPage = () => (
  <LoginPageStyles>
    <LoginImageContainer src={LoginImage} alt='Login Page Image' />
    <SignInFormStyles>
      <h1>Vbee OMS</h1>
      <SignIn />
    </SignInFormStyles>
  </LoginPageStyles>
);

export default LoginPage;
