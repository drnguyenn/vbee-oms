import BasePage from '../base/base.component';

import ProfileInputForm from '../../components/profile-input-form/profile-input-form.component';
import ProfileAvatar from '../../components/profile-avatar/profile-avatar.component';

import { ProfilePageStyles } from './profile.styles';

const ProfilePage = () => (
  <BasePage title='Profile'>
    <ProfilePageStyles>
      <ProfileInputForm />
      <ProfileAvatar />
    </ProfilePageStyles>
  </BasePage>
);

export default ProfilePage;
