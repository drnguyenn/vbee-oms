import { makeStyles, Tooltip } from '@material-ui/core';
import { Sync } from '@material-ui/icons';

import { SyncIndicatorStyles, Spinner } from './sync-indicator.styles';

const useStyles = makeStyles({
  icon: {
    width: '35px',
    height: '35px'
  }
});

const SyncIndicator = ({ spin = false }) => {
  const classes = useStyles();

  return (
    <SyncIndicatorStyles>
      <Tooltip
        title={spin ? 'Synchronizing changes...' : 'All changes saved'}
        placement='left'
        arrow
      >
        <Spinner spin={spin}>
          <Sync className={classes.icon} />
        </Spinner>
      </Tooltip>
    </SyncIndicatorStyles>
  );
};

export default SyncIndicator;
