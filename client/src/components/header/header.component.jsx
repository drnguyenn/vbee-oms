import { IconButton } from '@material-ui/core';
import { Notifications } from '@material-ui/icons';

import SearchBar from '../search-bar/search-bar.component';
import AvatarDropdown from '../avatar-dropdown/avatar-dropdown.component';

import { HeaderStyles, OptionsContainer } from './header.styles';

const Header = () => (
  <HeaderStyles>
    <SearchBar />

    <OptionsContainer>
      <IconButton>
        <Notifications />
      </IconButton>
      <AvatarDropdown />
    </OptionsContainer>
  </HeaderStyles>
);

export default Header;
