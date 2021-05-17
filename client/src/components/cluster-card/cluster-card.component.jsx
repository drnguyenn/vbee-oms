import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Card, CardContent, Grow, makeStyles } from '@material-ui/core';
import { Storage, People } from '@material-ui/icons';

import ROUTE_PATHS from '../../router/route-paths';

import Spinner from '../spinner/spinner.component';

import themes from '../../themes';

import {
  TitleStyles,
  SubtitleStyles,
  ClusterMetricsStyles
} from './cluster-card.styles';

const useStyles = makeStyles({
  card: {
    width: 400,
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
  }
});

const ClusterCard = ({
  id = '',
  name = '',
  description = '',
  memberCount = 0,
  serviceCount = 0,
  isNew
}) => {
  const classes = useStyles();

  const history = useHistory();

  const { isProcessing } = useSelector(state => state.cluster);

  const handleDirect = () => history.push(`${ROUTE_PATHS.CLUSTERS}/${id}`);

  return (
    <Grow in>
      <Card className={classes.card} onClick={handleDirect}>
        <Spinner
          open={isProcessing && isNew}
          backdropClasses={classes.spinner}
        />
        <CardContent className={classes.cardContent}>
          <TitleStyles>{name}</TitleStyles>
          <SubtitleStyles>
            {description.length < 110
              ? description
              : `${description.substring(0, 108)}...`}
          </SubtitleStyles>
          <ClusterMetricsStyles>
            <Storage className={classes.icon} color='primary' />
            {serviceCount} service{serviceCount > 1 && 's'}
          </ClusterMetricsStyles>
          <ClusterMetricsStyles>
            <People className={classes.icon} color='primary' />
            {memberCount} member{memberCount > 1 && 's'}
          </ClusterMetricsStyles>
        </CardContent>
      </Card>
    </Grow>
  );
};

export default ClusterCard;
