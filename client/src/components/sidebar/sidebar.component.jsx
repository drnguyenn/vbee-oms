import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { IconButton, Tooltip } from '@material-ui/core';
import {
  Dashboard,
  AmpStories,
  Storage,
  Kitchen,
  People,
  Settings
} from '@material-ui/icons';

import { togglePreferencesModal } from '../../redux/modal/modal.actions';

import {
  CustomToggleButtonGroup,
  CustomToggleButton
} from '../custom-toggle-buttons/custom-toggle-buttons.component';

import VbeeOMSLogoDark from '../../assets/logos/vbee-oms-logo-dark.svg';
import VbeeOMSLogoLight from '../../assets/logos/vbee-oms-logo-light.svg';

import ROUTE_PATHS from '../../router/route-paths';

import { SidebarStyles, LogoContainer, Logo } from './sidebar.styles';

const Sidebar = () => {
  const SIDEBAR_ROUTE_PATHS = useMemo(
    () => [
      ROUTE_PATHS.DASHBOARD,
      ROUTE_PATHS.CLUSTERS,
      ROUTE_PATHS.SERVICES,
      ROUTE_PATHS.REPOSITORIES,
      ROUTE_PATHS.MEMBERS
    ],
    []
  );

  const { type } = useSelector(state => state.theme);
  const { openPreferencesModal } = useSelector(state => state.modal);

  const [value, setValue] = useState();

  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    // Check pathname in the first render
    const { pathname: initialPathname } = history.location;

    if (SIDEBAR_ROUTE_PATHS.includes(initialPathname))
      setValue(initialPathname);

    // Check pathname in subsequent renderings
    const unlisten = history.listen(location => {
      const { pathname } = location;

      if (SIDEBAR_ROUTE_PATHS.includes(pathname)) setValue(pathname);
      else setValue(null);
    });

    return unlisten;
  }, [history, SIDEBAR_ROUTE_PATHS]);

  const handleChange = (event, newValue) => {
    if (newValue) {
      history.push(newValue);
      setValue(newValue);
    }
  };

  const handleClick = () => dispatch(togglePreferencesModal());

  return (
    <SidebarStyles theme={type}>
      <LogoContainer to={ROUTE_PATHS.HOME}>
        <Logo
          src={type === 'dark' ? VbeeOMSLogoDark : VbeeOMSLogoLight}
          alt='Logo'
        />
      </LogoContainer>

      <CustomToggleButtonGroup
        orientation='vertical'
        value={value}
        exclusive
        onChange={handleChange}
      >
        <CustomToggleButton title='Dashboard' value={ROUTE_PATHS.DASHBOARD}>
          <Dashboard />
        </CustomToggleButton>
        <CustomToggleButton title='Clusters' value={ROUTE_PATHS.CLUSTERS}>
          <AmpStories />
        </CustomToggleButton>
        <CustomToggleButton title='Services' value={ROUTE_PATHS.SERVICES}>
          <Storage />
        </CustomToggleButton>
        <CustomToggleButton
          title='Repositories'
          value={ROUTE_PATHS.REPOSITORIES}
        >
          <Kitchen />
        </CustomToggleButton>
        <CustomToggleButton title='Members' value={ROUTE_PATHS.MEMBERS}>
          <People />
        </CustomToggleButton>
      </CustomToggleButtonGroup>

      <Tooltip title='Preferences' placement='right' arrow>
        <IconButton onClick={handleClick}>
          <Settings color={openPreferencesModal ? 'inherit' : 'disabled'} />
        </IconButton>
      </Tooltip>
    </SidebarStyles>
  );
};

export default Sidebar;
