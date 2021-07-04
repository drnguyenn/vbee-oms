import { useSelector } from 'react-redux';

import LoginForm from 'components/login-form/login-form.component';

import LoginImage from 'assets/images/login-page.png';
import VbeeOMSLogoLandscapeDark from 'assets/logos/vbee-oms-logo-landscape-dark.svg';
import VbeeOMSLogoLandscapeLight from 'assets/logos/vbee-oms-logo-landscape-light.svg';

import {
  LoginPageStyles,
  LoginImageContainer,
  Logo,
  LoginAndLogoStyles
} from './log-in.styles';

const LoginPage = () => {
  const { type } = useSelector(state => state.theme);

  return (
    <LoginPageStyles>
      <LoginImageContainer src={LoginImage} alt='Login Page Image' />
      <LoginAndLogoStyles>
        <Logo
          src={
            type === 'dark'
              ? VbeeOMSLogoLandscapeDark
              : VbeeOMSLogoLandscapeLight
          }
          alt='Logo'
        />
        <LoginForm />
      </LoginAndLogoStyles>
    </LoginPageStyles>
  );
};

export default LoginPage;
