import { memo } from 'react';
import MUIDataTable from 'mui-datatables';

import {
  CircularProgress,
  LinearProgress,
  Tooltip,
  makeStyles
} from '@material-ui/core';

import { TableStyles } from './table.styles';

const useStyles = makeStyles({
  linearProgress: {
    position: 'absolute',
    width: '100%',
    borderRadius: '8px 8px 0 0'
  },
  toolbarLoader: {
    margin: 14,
    verticalAlign: 'middle'
  },
  rowLoader: {
    width: 48,
    height: 48,
    textAlign: 'center',
    padding: 12
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

export const ToolbarLoader = ({ tooltipTitle = 'Processing...' }) => {
  const classes = useStyles();

  return (
    <Tooltip title={tooltipTitle}>
      <CircularProgress className={classes.toolbarLoader} size={20} />
    </Tooltip>
  );
};

export const RowLoader = ({ tooltipTitle = 'Processing...' }) => {
  const classes = useStyles();

  return (
    <Tooltip title={tooltipTitle}>
      <div className={classes.rowLoader}>
        <CircularProgress size={20} />
      </div>
    </Tooltip>
  );
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
