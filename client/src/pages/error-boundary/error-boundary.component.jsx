/* eslint-disable no-console */
import { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Fab } from '@material-ui/core';

import ErrorPageImage from '../../assets/images/error-page.png';

import {
  ErrorImageOverlay,
  ErrorImageStyles,
  ErrorImageText
} from './error-boundary.styles';

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
    console.log(info);
    if (error) console.error(error);
  }

  render() {
    const { hasErrored } = this.state;
    const { children, history } = this.props;

    if (hasErrored)
      return (
        <ErrorImageOverlay>
          <ErrorImageStyles src={ErrorPageImage} alt='Error Page Image' />
          <ErrorImageText>Sorry, this page is broken</ErrorImageText>
          <Fab
            variant='extended'
            type='submit'
            onClick={() => history.push('/')}
          >
            Back to home
          </Fab>
        </ErrorImageOverlay>
      );

    return children;
  }
}

export default withRouter(ErrorBoundary);
