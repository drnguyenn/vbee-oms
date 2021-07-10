import { useMemo } from 'react';
import {
  Card,
  CardContent,
  Grow,
  Typography,
  makeStyles
} from '@material-ui/core';

import Spinner from 'components/spinner/spinner.component';

const useStyles = makeStyles(theme => ({
  card: {
    width: 350,
    cursor: 'pointer',

    [theme.breakpoints.down('xs')]: {
      width: 250
    }
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  spinner: {
    position: 'absolute',
    zIndex: 1
  },
  title: {
    fontSize: 'initial',
    fontWeight: 'bold',
    marginBottom: '0.35rem'
  },
  description: {
    height: 60,
    margin: '1rem 0',
    opacity: 0.9,
    whiteSpace: 'pre-wrap'
  }
}));

const BaseCard = ({
  title = '',
  subtitle = '',
  description = '',
  isProcessing = false,
  isNew = false,
  handleClick = () => {},
  children
}) => {
  const classes = useStyles();

  const Description = useMemo(() => {
    if (typeof description === 'string') {
      if (!description.length) return <em>No description provided</em>;

      return description.length <= 95
        ? description
        : `${description.substring(0, 95)}...`;
    }

    return description;
  }, [description]);

  return (
    <Grow in>
      <Card className={classes.card} onClick={handleClick} raised>
        <Spinner
          open={isProcessing && isNew}
          backdropClasses={classes.spinner}
        />

        <CardContent className={classes.cardContent}>
          <div className={classes.title}>{title}</div>
          <Typography variant='body2'>{subtitle}</Typography>
          <Typography
            className={classes.description}
            variant='body2'
            gutterBottom
          >
            {Description}
          </Typography>

          {children}
        </CardContent>
      </Card>
    </Grow>
  );
};

export default BaseCard;
