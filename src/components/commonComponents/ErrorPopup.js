import React from 'react'

const ErrorPopup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-red-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6 text-red-600 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9z"
              />
            </svg>
            Error
          </h2>
        </div>
        <p className="mt-4 text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 transition"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default ErrorPopup
