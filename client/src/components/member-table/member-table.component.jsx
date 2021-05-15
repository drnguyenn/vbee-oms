import MUIDataTable from 'mui-datatables';

const MemberTable = ({
  columns = [],
  data = [],
  downloadFilename = 'members.csv'
}) => {
  const options = {
    filter: true,
    filterType: 'multiselect',
    responsive: 'standard',
    tableBodyMaxHeight: '400px',
    selectableRowsHeader: false,
    selectableRowsHideCheckboxes: true,
    jumpToPage: true,
    downloadOptions: {
      filename: downloadFilename
    }
  };

  return (
    <MUIDataTable title='' columns={columns} options={options} data={data} />
  );
};

export default MemberTable;
