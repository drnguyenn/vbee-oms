import { useMemo } from 'react';
import {
  Card,
  CardContent,
  Grow,
  Typography,
  makeStyles
} from '@material-ui/core';

import Spinner from 'components/spinner/spinner.component';

const useStyles = makeStyles({
  card: {
    width: 350,
    cursor: 'pointer'
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
    fontWeight: 'bold'
  },
  subtitle: {
    marginBottom: '1rem'
  },
  description: {
    height: 50,
    opacity: 0.9
  }
});

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
    if (description)
      return description.length <= 90
        ? description
        : `${description.substring(0, 90)}...`;

    return <em>No description provided</em>;
  }, [description]);

  return (
    <Grow in>
      <Card className={classes.card} onClick={handleClick} raised>
        <Spinner
          open={isProcessing && isNew}
          backdropClasses={classes.spinner}
        />

        <CardContent className={classes.cardContent}>
          <Typography className={classes.title} gutterBottom>
            {title}
          </Typography>
          <Typography className={classes.subtitle} variant='body2'>
            {subtitle}
          </Typography>
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
