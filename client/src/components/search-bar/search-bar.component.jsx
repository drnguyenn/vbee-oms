import { InputBase, fade, makeStyles } from '@material-ui/core';
import { Search } from '@material-ui/icons';

import { SearchBarStyles } from './search-bar.styles';

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    borderRadius: '23px',
    backgroundColor: fade(
      theme.palette.type === 'dark'
        ? theme.palette.common.white
        : theme.palette.grey[500],
      0.15
    ),
    '&:hover': {
      backgroundColor: fade(
        theme.palette.type === 'dark'
          ? theme.palette.common.white
          : theme.palette.grey[500],
        0.25
      )
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto'
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '40ch'
      }
    }
  }
}));

const SearchBar = ({ onChange }) => {
  const classes = useStyles();

  return (
    <SearchBarStyles>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <Search />
        </div>
        <InputBase
          type='search'
          placeholder='Search...'
          autoComplete='off'
          onChange={onChange}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </div>
    </SearchBarStyles>
  );
};

export default SearchBar;
