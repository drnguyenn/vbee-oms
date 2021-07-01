import { InputBase, fade, makeStyles } from '@material-ui/core';
import { Search } from '@material-ui/icons';

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
    outline: 'none',

    '&:hover': {
      backgroundColor: fade(
        theme.palette.type === 'dark'
          ? theme.palette.common.white
          : theme.palette.grey[500],
        0.25
      )
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

    [theme.breakpoints.down('sm')]: {
      width: '18ch',
      '&:focus': {
        width: '30ch'
      }
    },

    [theme.breakpoints.down('xs')]: {
      width: 0,
      '&:focus': {
        width: '20ch'
      }
    }
  }
}));

const SearchBar = ({ onChange }) => {
  const classes = useStyles();

  return (
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
  );
};

export default SearchBar;
