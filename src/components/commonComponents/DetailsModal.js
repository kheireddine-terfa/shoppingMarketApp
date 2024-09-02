import React from 'react'

const DetailsModal = ({ isOpen, onClose, title, data, formatDate }) => {
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
                    {/* Check if item.value is an object and render appropriately */}
                    {typeof item.value === 'object'
                      ? JSON.stringify(item.value)
                      : item.value}
                  </span>
                </div>
              ),
          )}
          {/* Check for any formatted date fields */}
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
