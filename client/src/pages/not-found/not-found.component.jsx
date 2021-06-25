import { useHistory } from 'react-router-dom';

import { Fab, Typography, makeStyles } from '@material-ui/core';

import BasePage from '../base/base.component';

import NotFoundPageImage from '../../assets/images/not-found-page.svg';

import { NotFoundImageStyles } from './not-found.styles';

const useStyles = makeStyles({
  content: {
    marginBottom: '1rem'
  }
});

const NotFoundPage = () => {
  const classes = useStyles();

  const history = useHistory();

  return (
    <BasePage textAlign='center'>
      <NotFoundImageStyles src={NotFoundPageImage} alt='404 Page Image' />
      <Typography variant='h4' component='h1' gutterBottom>
        Oops, something &apos;s missing...
      </Typography>
      <Typography className={classes.content}>
        It seems like we donut find what you searched.
        <br />
        The page you were looking for does not exist, is unavailable or was
        loading incorrectly.
      </Typography>
      <Fab variant='extended' color='primary' onClick={() => history.push('/')}>
        Back to home
      </Fab>
    </BasePage>
  );
};

export default NotFoundPage;
