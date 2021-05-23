import { makeStyles, Paper } from '@material-ui/core';

import themes from '../../themes';

import {
  SectionHeaderStyles,
  SectionTitleAndSubtitleStyles,
  SectionTitleStyles,
  SectionSubtitleStyles
} from './section.styles';

const useStyles = makeStyles({
  paper: {
    position: 'relative',
    background: 'none',
    width: '90%',
    margin: `${themes.lengthMd2} auto`,
    padding: themes.lengthSm3,

    '&:first-child': {
      marginTop: 0
    },
    '&:last-child': {
      marginBottom: 0
    }
  }
});

const Section = ({ title, subtitle, headerOptions, children }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper} variant='outlined'>
      <SectionHeaderStyles>
        <SectionTitleAndSubtitleStyles>
          <SectionTitleStyles>{title}</SectionTitleStyles>
          <SectionSubtitleStyles>{subtitle}</SectionSubtitleStyles>
        </SectionTitleAndSubtitleStyles>
        {headerOptions}
      </SectionHeaderStyles>
      {children}
    </Paper>
  );
};

export default Section;
