import SignIn from '../../components/sign-in/sign-in.component';

import LandingImage from '../../assets/images/landing-page.png';

import {
  LandingPageStyles,
  LandingImageContainer,
  SignInFormStyles
} from './landing.styles';

const LandingPage = () => (
  <LandingPageStyles>
    <LandingImageContainer src={LandingImage} alt='Landing Page Image' />
    <SignInFormStyles>
      <h1>Vbee OMS</h1>
      <SignIn />
    </SignInFormStyles>
  </LandingPageStyles>
);

export default LandingPage;
