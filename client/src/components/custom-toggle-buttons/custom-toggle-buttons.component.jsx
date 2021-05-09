import { withStyles, Tooltip } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';

export const CustomToggleButtonGroup = withStyles(theme => ({
  grouped: {
    margin: theme.spacing(0.5),
    border: 'none',
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius
    }
  }
}))(ToggleButtonGroup);

export const CustomToggleButton = ({
  tooltipPlacement = 'right',
  title,
  value,
  children,
  ...rest
}) => (
  <Tooltip title={title} placement={tooltipPlacement} arrow>
    <ToggleButton value={value} {...rest}>
      {children}
    </ToggleButton>
  </Tooltip>
);
