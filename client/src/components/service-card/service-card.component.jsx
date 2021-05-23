import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  Card,
  CardContent,
  Grow,
  Typography,
  makeStyles
} from '@material-ui/core';
import { People, CheckCircle, Error } from '@material-ui/icons';

import ROUTE_PATHS from '../../router/route-paths';

import Spinner from '../spinner/spinner.component';

import themes from '../../themes';

import {
  HeaderStyles,
  TitleStyles,
  TitleCaptionStyles,
  SubtitleStyles,
  ServiceMetricsStyles
} from './service-card.styles';

const useStyles = variant =>
  makeStyles(muiTheme => ({
    card: {
      width: variant === 'small' ? 300 : 400,
      cursor: 'pointer',
      position: 'relative'
    },
    cardContent: {
      display: 'flex',
      flexDirection: 'column'
    },
    icon: {
      marginRight: themes.lengthSm2
    },
    spinner: {
      position: 'absolute',
      zIndex: 1
    },
    success: {
      color: muiTheme.palette.success.light
    }
  }));

const ServiceCard = ({
  id = '',
  name = '',
  description = '',
  version = '',
  status,
  memberCount = 0,
  cluster = {},
  isNew = false,
  variant = 'default'
}) => {
  const classes = useStyles(variant)();

  const history = useHistory();

  const { isProcessing } = useSelector(state => state.service);

  const handleDirect = () => history.push(`${ROUTE_PATHS.SERVICES}/${id}`);

  return (
    <Grow in>
      <Card className={classes.card} onClick={handleDirect}>
        <Spinner
          open={isProcessing && isNew}
          backdropClasses={classes.spinner}
        />
        <CardContent className={classes.cardContent}>
          <HeaderStyles>
            <TitleStyles>{name}</TitleStyles>
            {status === 'healthy' ? (
              <CheckCircle className={classes.success} color='primary' />
            ) : (
              <Error color='error' />
            )}
          </HeaderStyles>
          {variant === 'default' && (
            <TitleCaptionStyles>
              of <b>{cluster && cluster.name && cluster.name}</b>
            </TitleCaptionStyles>
          )}
          <SubtitleStyles>
            {description.length < 110
              ? description
              : `${description.substring(0, 108)}...`}
          </SubtitleStyles>
          <Typography color='primary'>{version && `v${version}`}</Typography>
          <ServiceMetricsStyles>
            <People className={classes.icon} color='primary' />
            {memberCount} member{memberCount > 1 && 's'}
          </ServiceMetricsStyles>
        </CardContent>
      </Card>
    </Grow>
  );
};

ServiceCard.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  version: PropTypes.string,
  status: PropTypes.string,
  memberCount: PropTypes.number,
  cluster: PropTypes.shape({}),
  isNew: PropTypes.bool,
  variant: PropTypes.string
};

ServiceCard.defaultProps = {
  id: '',
  name: '',
  description: '',
  version: '',
  status: 'healthy',
  memberCount: 0,
  cluster: {},
  isNew: false,
  variant: 'default'
};

export default ServiceCard;
