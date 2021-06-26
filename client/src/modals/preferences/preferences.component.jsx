import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  makeStyles
} from '@material-ui/core';

import { setPreferencesModalOpen } from '../../redux/modal/modal.actions';
import { switchTheme } from '../../redux/theme/theme.actions';

import themes from '../../themes';

const useStyles = makeStyles({
  formLabel: {
    marginBottom: themes.lengthSm1
  }
});

const PreferencesModal = () => {
  const classes = useStyles();

  const { openPreferencesModal } = useSelector(state => state.modal);
  const { type } = useSelector(state => state.theme);

  const [value, setValue] = useState(type);

  const dispatch = useDispatch();

  const handleClose = () => dispatch(setPreferencesModalOpen(false));

  const handleChange = event => {
    setValue(event.target.value);

    dispatch(switchTheme(event.target.value));
  };

  return (
    <Dialog fullWidth open={openPreferencesModal} onClose={handleClose}>
      <DialogTitle>Preferences</DialogTitle>
      <DialogContent>
        <FormControl>
          <FormLabel className={classes.formLabel}>THEME</FormLabel>
          <RadioGroup value={value} onChange={handleChange}>
            <FormControlLabel
              value='dark'
              control={<Radio color='primary' />}
              label='Dark'
            />
            <FormControlLabel
              value='light'
              control={<Radio color='primary' />}
              label='Light'
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
};

export default PreferencesModal;
