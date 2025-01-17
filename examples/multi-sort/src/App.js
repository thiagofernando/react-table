import React                   from 'react';
import styled                  from 'styled-components';
import { useTable, useSortBy } from 'react-table';
import classes from './App.module.css';

import makeData from './makeData';

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;


function Table({columns, data}) {
  const {
          getTableProps,
          getTableBodyProps,
          headerGroups,
          rows,
          prepareRow,
        } = useTable(
    {
      columns,
      data,
      enableMultiSortClick: true
    },
    useSortBy
  );
  
  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 20);
  
  return (
    <>
      <table {...getTableProps()}>
        <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => {
              let sortable = null;
  
              if (!!column.canSort) {
                let style = classes.SortNone;
                if (!!column.isSortedDesc) style = classes.SortDesc;
                else if (column.isSortedDesc === false) style = classes.SortAsc;
                sortable = <span {...column.getSortByToggleProps()} className={[classes.Sort, style].join(' ')}/>;
              }
              
              return (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps()}>
                  <div style={{display: 'flex', justifyContent: 'center'}}>
                    {column.render('Header')}
                    {sortable}
                    {
                      column.sortedIndex > -1 && <span style={{
                        marginLeft: '0.5em',
                        fontSize  : '0.7rem',
                        float     : 'right'
                      }}> {column.sortedIndex + 1}      </span>
                    }
                  </div>
                </th>
              );
            })}
          </tr>
        ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {firstPageRows.map(
          (row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          }
        )}
        </tbody>
      </table>
      <br/>
      <div>Showing the first 20 results of {rows.length} rows</div>
    </>
  );
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header : 'Name',
        columns: [
          {
            Header  : 'First Name',
            accessor: 'firstName',
          },
          {
            Header  : 'Last Name',
            accessor: 'lastName',
          },
        ],
      },
      {
        Header : 'Info',
        columns: [
          {
            Header  : 'Age',
            accessor: 'age',
          },
          {
            Header  : 'Visits',
            accessor: 'visits',
          },
          {
            Header  : 'Status',
            accessor: 'status',
          },
          {
            Header  : 'Profile Progress',
            accessor: 'progress',
          },
        ],
      },
    ],
    []
  );
  
  const data = React.useMemo(() => makeData(2000), []);
  
  return (
    <Styles>
      <Table columns={columns} data={data}/>
    </Styles>
  );
}

export default App;
