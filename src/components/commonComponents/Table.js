import React from 'react'
import TableHeaderCell from './TableHeaderCell' // Import the new component
import TableRow from './TableRow'

const Table = ({ data, actions }) => {
  return (
    <div className="flex-auto block py-8 pt-6 px-9">
      <div className="overflow-x-auto">
        <table className="w-full my-0 align-middle text-dark border-neutral-200">
          <thead className="align-bottom">
            <tr className="font-semibold text-[0.95rem] text-secondary-dark">
              <TableHeaderCell
                title="Title"
                className="pb-3 text-start min-w-[175px]"
              />
              <TableHeaderCell
                title="Price"
                className="pb-3 text-start min-w-[100px]"
              />
              <TableHeaderCell
                title="Sales"
                className="pb-3 text-start min-w-[100px]"
              />
              <TableHeaderCell
                title="Inventory State"
                className="pb-3 text-start min-w-[175px]"
              />
              <TableHeaderCell
                title="Manage"
                className="pb-3 pr-12 text-start min-w-[175px]"
              />
              <TableHeaderCell
                title="Details"
                className="pb-3 text-end min-w-[50px]"
              />
            </tr>
          </thead>
          <tbody>
            {data.map((dataItem, index) => (
              <TableRow key={index} actions={actions} dataItem={dataItem} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table
