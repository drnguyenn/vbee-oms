import { useState } from 'react';
import { findLastKey } from 'lodash';

import {
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  makeStyles,
  OutlinedInput,
  InputAdornment,
  Tooltip
} from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';

const INPUT_ID_PREFIX = 'input';

const useStyles = makeStyles({
  addInputButton: {
    float: 'right'
  }
});

export const useInputGroup = () => {
  const [inputs, setInputs] = useState({ [`${INPUT_ID_PREFIX}1`]: '' });

  const handleInputChange = event => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleAddInput = () => {
    const newInputId = `${INPUT_ID_PREFIX}${
      parseInt(findLastKey(inputs, {}).substring(INPUT_ID_PREFIX.length), 10) +
      1
    }`;

    setInputs({ ...inputs, [newInputId]: '' });
  };

  const handleRemoveInput = id => () => {
    const { [id]: inputId, ...rest } = inputs;

    setInputs({ ...rest });
  };

  return [inputs, { handleInputChange, handleAddInput, handleRemoveInput }];
};

const InputGroup = ({
  required = false,
  autoFocus = false,
  inputs = [],
  inputLabel = 'Input',
  placeholder = 'Input',
  disabled = false,
  handleInputChange = () => {},
  handleAddInput = () => {},
  handleRemoveInput = () => {},
  addButtonTitle = 'Add more input',
  removeButtonTitle = 'Remove input'
}) => {
  const classes = useStyles();

  return (
    <>
      {Object.entries(inputs).map(([key, value], index) => (
        <Fade key={key} in timeout={500}>
          <FormControl variant='outlined' margin='normal' fullWidth>
            <InputLabel htmlFor={key}>
              {inputLabel} {key.substring(INPUT_ID_PREFIX.length)}{' '}
              {required && '*'}
            </InputLabel>
            <OutlinedInput
              required={required}
              id={key}
              autoComplete='off'
              autoFocus={autoFocus}
              name={key}
              type='text'
              value={value}
              onChange={handleInputChange}
              disabled={disabled}
              placeholder={placeholder}
              label={`${inputLabel} ${key.substring(INPUT_ID_PREFIX.length)}`}
              endAdornment={
                index > 0 ? (
                  <InputAdornment position='end'>
                    <Tooltip title={removeButtonTitle} arrow placement='left'>
                      <IconButton onClick={handleRemoveInput(key)} edge='end'>
                        <Remove />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ) : (
                  <div />
                )
              }
            />
          </FormControl>
        </Fade>
      ))}
      <Tooltip
        className={classes.addInputButton}
        title={addButtonTitle}
        arrow
        placement='left'
      >
        <IconButton onClick={handleAddInput} color='primary'>
          <Add />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default InputGroup;
