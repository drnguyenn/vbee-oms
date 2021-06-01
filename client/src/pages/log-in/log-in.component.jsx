import SignIn from '../../components/sign-in/sign-in.component';

import LandingImage from '../../assets/images/landing-page.png';

import {
  LoginPageStyles,
  LandingImageContainer,
  SignInFormStyles
} from './log-in.styles';

const LoginPage = () => (
  <LoginPageStyles>
    <LandingImageContainer src={LandingImage} alt='Landing Page Image' />
    <SignInFormStyles>
      <h1>Vbee OMS</h1>
      <SignIn />
    </SignInFormStyles>
  </LoginPageStyles>
);

export default LoginPage;
