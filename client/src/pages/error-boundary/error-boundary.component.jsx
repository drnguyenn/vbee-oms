/* eslint-disable no-console */
import { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Fab, Typography, withStyles } from '@material-ui/core';

import BasePage from 'pages/base/base.component';

import ErrorImage from 'assets/images/error.svg';

import { ErrorImageStyles } from './error-boundary.styles';

const useStyles = () => ({
  content: {
    marginBottom: '1rem'
  }
});
class ErrorBoundary extends Component {
  constructor() {
    super();

    this.state = {
      hasErrored: false
    };
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(error) {
    return { hasErrored: true };
  }

  componentDidCatch(error, info) {
    console.info(info);
    if (error) console.error(error);
  }

  render() {
    const { hasErrored } = this.state;
    const { children, history, classes } = this.props;

    if (hasErrored)
      return (
        <BasePage textAlign='center'>
          <ErrorImageStyles src={ErrorImage} alt='Error Boundary Page Image' />
          <Typography variant='h4' component='h1' gutterBottom>
            Sorry, this page is temporarily unavailable
          </Typography>
          <Typography className={classes.content}>
            It seems like something has gone wrong. Please come back later.
          </Typography>
          <Fab
            variant='extended'
            color='primary'
            onClick={() => history.push('/')}
          >
            Back to home
          </Fab>
        </BasePage>
      );

    return children;
  }
}

export default withRouter(withStyles(useStyles)(ErrorBoundary));
