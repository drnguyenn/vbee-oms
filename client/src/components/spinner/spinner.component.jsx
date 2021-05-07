import { Backdrop, CircularProgress } from '@material-ui/core';

const Spinner = ({ open = true, backdropClasses }) => (
  <Backdrop open={open} className={backdropClasses}>
    <CircularProgress color='primary' />
  </Backdrop>
);

export default Spinner;
