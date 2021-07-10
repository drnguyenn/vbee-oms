import PropTypes from 'prop-types';

import {
  Tooltip,
  IconButton,
  useMediaQuery,
  useTheme,
  makeStyles
} from '@material-ui/core';
import { ArrowBackIosOutlined } from '@material-ui/icons';

import {
  BasePageStyles,
  HeaderStyles,
  TitleStyles,
  SubtitleStyles
} from './base.styles';

const useStyles = makeStyles(theme => ({
  iconButton: {
    position: 'fixed',
    top: 52,
    left: 85,
    zIndex: 1099,

    [theme.breakpoints.down('sm')]: {
      left: 65
    }
  }
}));

const BasePage = ({
  title,
  subtitle,
  textAlign,
  children,
  showHeaderButton,
  tooltipTitle,
  headerButtonIcon,
  headerButtonOnClick
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:440px)');

  return (
    <BasePageStyles textAlign={textAlign}>
      <HeaderStyles backgroundColor={theme.palette.background.default}>
        <TitleStyles>{title}</TitleStyles>
      </HeaderStyles>
      <SubtitleStyles color={theme.palette.text.secondary}>
        {subtitle}
      </SubtitleStyles>

      {showHeaderButton && (
        <Tooltip title={tooltipTitle} arrow>
          <IconButton
            className={classes.iconButton}
            onClick={headerButtonOnClick}
            size={matches ? 'small' : 'medium'}
          >
            {headerButtonIcon}
          </IconButton>
        </Tooltip>
      )}

      {children}
    </BasePageStyles>
  );
};

BasePage.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  textAlign: PropTypes.string,
  showHeaderButton: PropTypes.bool,
  tooltipTitle: PropTypes.string,
  headerButtonIcon: PropTypes.element,
  headerButtonOnClick: PropTypes.func
};

BasePage.defaultProps = {
  title: '',
  subtitle: '',
  textAlign: 'initial',
  showHeaderButton: false,
  tooltipTitle: '',
  headerButtonIcon: <ArrowBackIosOutlined />,
  headerButtonOnClick: () => {}
};

export default BasePage;
