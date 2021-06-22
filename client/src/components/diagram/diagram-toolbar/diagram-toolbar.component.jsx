import { memo } from 'react';

import { makeStyles, Paper, Tooltip } from '@material-ui/core';
import { Ballot } from '@material-ui/icons';

import themes from '../../../themes';

import { DiagramToolbarItemStyles } from './diagram-toolbar.styles';

const useStyles = makeStyles({
  paper: {
    position: 'fixed',
    left: '50%',
    bottom: themes.lengthMd2,
    width: 'fit-content',
    padding: themes.lengthSm1
  },
  icon: {
    width: '100%',
    height: '100%'
  }
});

const DiagramToolbar = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Tooltip title='Node' arrow>
        <DiagramToolbarItemStyles draggable>
          <Ballot className={classes.icon} />
        </DiagramToolbarItemStyles>
      </Tooltip>
    </Paper>
  );
};

export default memo(DiagramToolbar);
