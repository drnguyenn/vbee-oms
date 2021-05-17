import MUIDataTable from 'mui-datatables';

import { LinearProgress } from '@material-ui/core';

const getInitialOptions = isLoading => ({
  filter: true,
  filterType: 'multiselect',
  responsive: 'standard',
  tableBodyMaxHeight: '400px',
  selectableRowsHeader: false,
  selectableRowsHideCheckboxes: true,
  jumpToPage: true,
  textLabels: {
    body: {
      noMatch: isLoading ? <LinearProgress /> : 'No data found'
    }
  }
});

const Table = ({
  title = '',
  columns = [],
  data = [],
  options = {},
  isLoading = false
}) => (
  <MUIDataTable
    title={title}
    columns={columns}
    options={{ ...getInitialOptions(isLoading), ...options }}
    data={data}
  />
);

export default Table;
