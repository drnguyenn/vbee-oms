import { memo } from 'react';
import MUIDataTable from 'mui-datatables';

import { LinearProgress, makeStyles } from '@material-ui/core';

import { TableStyles } from './table.styles';

const useStyles = makeStyles({
  linearProgress: {
    position: 'absolute',
    width: '100%',
    borderRadius: '8px 8px 0 0'
  }
});

const initialOptions = {
  filter: true,
  filterType: 'multiselect',
  responsive: 'standard',
  tableBodyMaxHeight: '400px',
  selectableRowsHeader: false,
  selectableRowsHideCheckboxes: true,
  jumpToPage: true,
  textLabels: {
    body: {
      noMatch: 'No data found'
    }
  }
};

const Table = ({
  title = '',
  columns = [],
  data = [],
  options = {},
  isLoading = false
}) => {
  const classes = useStyles();

  return (
    <TableStyles>
      {isLoading && <LinearProgress className={classes.linearProgress} />}
      <MUIDataTable
        title={title}
        columns={columns}
        options={{ ...initialOptions, ...options }}
        data={data}
      />
    </TableStyles>
  );
};

export default memo(Table);
