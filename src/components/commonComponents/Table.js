import React from 'react'
import TableHeaderCell from './TableHeaderCell' // Import the new component
import TableRow from './TableRow'

const Table = ({ data, actions, headerConfig, tableTitle }) => {
  return (
    <div className="flex-auto block py-8 pt-6 px-9">
      <div className="overflow-x-auto">
        <table className="w-full my-0 align-middle text-dark border-neutral-200">
          <thead className="align-bottom">
            <tr className="font-semibold text-[0.95rem]  text-secondary-dark">
              {headerConfig.map((itemConfig, index) => (
                <TableHeaderCell
                  key={index}
                  title={itemConfig.title}
                  className={itemConfig.class}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((dataItem, index) => (
              <TableRow
                key={index}
                actions={actions}
                dataItem={dataItem}
                tableTitle={tableTitle}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table
