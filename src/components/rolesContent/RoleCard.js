import React from 'react'

const RoleCard = ({ role, pages, onDelete, onUpdate, allowedActions }) => {
  return (
    <div className="w-80 flex flex-col rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200 m-4">
      {/* Card Header: Role Name */}
      <div className="bg-[#003248e3] text-white text-lg font-bold px-4 py-2">
        {role}
      </div>

      {/* Card Body: Pages List */}
      <div className="p-4 flex-1">
        <h3 className="font-semibold text-gray-700 mb-2">Pages:</h3>
        <ul className="list-disc list-inside">
          {pages.map((page, index) => (
            <li key={index} className="text-gray-600 ">
              {page.page}
              {' : '}
              <i className="text-blue-950 opacity-80"> {page.actions}</i>
            </li>
          ))}
        </ul>
      </div>

      {/* Card Footer: Delete and Update Icons */}
      <div className="px-4 py-3 bg-gray-100 flex justify-end space-x-4">
        {/* Delete Button */}
        {allowedActions.canDelete && (
          <button className="text-red-600" onClick={onDelete}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        )}
        {/* Update Button */}
        {allowedActions.canUpdate && (
          <button className="text-blue-600" onClick={onUpdate}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default RoleCard
