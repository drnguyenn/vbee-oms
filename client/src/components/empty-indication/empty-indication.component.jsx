import { Typography } from '@material-ui/core';

import EmptyImage from 'assets/images/empty.svg';

import {
  EmptyIndicationStyles,
  EmptyImageStyles
} from './empty-indication.styles';

const EmptyIndication = () => (
  <EmptyIndicationStyles>
    <EmptyImageStyles src={EmptyImage} alt='Empty Image' />
    <Typography variant='h4' component='h1' gutterBottom>
      There is nothing to show here
    </Typography>
  </EmptyIndicationStyles>
);

export default EmptyIndication;
