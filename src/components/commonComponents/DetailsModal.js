import React, { useState } from 'react'

const DetailsModal = ({
  isOpen,
  onClose,
  title,
  data,
  formatDate,
  tableData,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Calculate total pages
  const totalPages = Math.ceil(tableData.length / itemsPerPage)

  // Get current page data
  const currentTableData = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-2/4">
        <h2 className="text-xl text-center font-semibold mb-4">{title}</h2>
        <div className="space-y-2">
          {data.map(
            (item, index) =>
              item.label !== 'Expiration Dates' && (
                <div
                  key={index}
                  className={`flex justify-between ${
                    index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
                  } p-2 rounded-md`}
                >
                  <strong>{item.label}:</strong>
                  <span className={item.className}>
                    {typeof item.value === 'object'
                      ? JSON.stringify(item.value)
                      : item.value}
                  </span>
                </div>
              ),
          )}
          {data.some((item) => item.label === 'Expiration Dates') && (
            <div>
              <strong>Expiration Dates:</strong>
              <ul className="list-disc list-inside ml-4">
                {data
                  .find((item) => item.label === 'Expiration Dates')
                  .value.map((expiration, index) => (
                    <li key={index}>{formatDate(expiration.date)}</li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {tableData && tableData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">
              {title.startsWith('Sale')
                ? 'Products In Sale'
                : 'Products Details'}
            </h3>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 text-start border-b-2 border-gray-200">
                    Product
                  </th>
                  <th className="py-2 text-start border-b-2 border-gray-200">
                    {title.startsWith('Sale') ? 'Price' : 'Quantity'}
                  </th>
                  <th className="py-2 text-start border-b-2 border-gray-200">
                    {title.startsWith('Sale')
                      ? 'Sale Quantity'
                      : 'Purchase Price'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}
                  >
                    <td className="py-2 px-4 border-b border-gray-200">
                      {item.product || item.productName}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {item.quantity || `${item.productPrice} DA`}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {item.purchase_price ||
                        (!item.isBalanced
                          ? `${item.saleQuantity} UNIT(s)`
                          : `${item.saleQuantity} GRAM`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default DetailsModal
