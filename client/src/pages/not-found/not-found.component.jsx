import { useHistory } from 'react-router-dom';

import { Fab } from '@material-ui/core';

import NotFoundPageImage from '../../assets/images/not-found-page.svg';

import {
  NotFoundImageOverlay,
  NotFoundImageStyles,
  NotFoundImageTitle,
  NotFoundImageContent
} from './not-found.styles';

const NotFoundPage = () => {
  const history = useHistory();

  return (
    <NotFoundImageOverlay>
      <NotFoundImageStyles src={NotFoundPageImage} alt='404 Page Image' />
      <NotFoundImageTitle>
        Oops, something &apos;s missing...
      </NotFoundImageTitle>
      <NotFoundImageContent>
        It seems like we donut find what you searched.
        <br />
        The page you were looking for does not exist, is unavailable or was
        loading incorrectly.
      </NotFoundImageContent>
      <Fab
        variant='extended'
        color='primary'
        type='submit'
        onClick={() => history.push('/')}
      >
        Back to home
      </Fab>
    </NotFoundImageOverlay>
  );
};

export default NotFoundPage;
