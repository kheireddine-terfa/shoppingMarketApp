import React, { useState, useEffect } from 'react'

const AddRoleModal = ({ onSubmit, onCancel }) => {
  const [roleName, setRoleName] = useState('')
  const [pages, setPages] = useState([])
  const [selectedPermissions, setSelectedPermissions] = useState({})

  // Fetch pages with available actions
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:3001/api/pages', {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token
          },
        }) // Adjust the API endpoint as needed
        const data = await response.json()
        setPages(data.pages)
      } catch (error) {
        console.error('Error fetching pages:', error)
      }
    }
    fetchPages()
  }, [])

  // Handle role name change
  const handleRoleNameChange = (e) => {
    setRoleName(e.target.value)
  }

  // Handle page selection/deselection
  const handlePageSelection = (pageName) => {
    setSelectedPermissions((prevPermissions) => {
      // Toggle page selection
      const isPageSelected = !!prevPermissions[pageName]
      if (isPageSelected) {
        const updatedPermissions = { ...prevPermissions }
        delete updatedPermissions[pageName] // Remove page and its actions if deselected
        return updatedPermissions
      } else {
        return { ...prevPermissions, [pageName]: [] } // Initialize with no actions selected
      }
    })
  }

  // Handle action selection/deselection
  const handleActionChange = (pageName, action) => {
    setSelectedPermissions((prevPermissions) => {
      const pagePermissions = prevPermissions[pageName] || []
      const isSelected = pagePermissions.includes(action)

      const updatedPermissions = isSelected
        ? pagePermissions.filter((a) => a !== action) // Deselect action
        : [...pagePermissions, action] // Select action

      return { ...prevPermissions, [pageName]: updatedPermissions }
    })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    const roleData = {
      name: roleName,
      permissions: Object.keys(selectedPermissions).map((pageName) => ({
        page: pageName,
        actions: selectedPermissions[pageName].join(','), // Send selected actions as comma-separated string
      })),
    }
    onSubmit(roleData) // Pass the form data to the parent component
  }

  // Split the pages into two columns if there are more than 5 pages
  const firstColumnPages = pages.slice(0, 5)
  const secondColumnPages = pages.length > 5 ? pages.slice(5) : []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 mt-8 rounded-lg shadow-lg w-2/3">
        <h2 className="text-xl text-center font-semibold mb-4">Add New Role</h2>

        <form onSubmit={handleSubmit}>
          {/* Role Name Input */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="roleName"
            >
              Role Name
            </label>
            <input
              type="text"
              id="roleName"
              value={roleName}
              onChange={handleRoleNameChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter role name"
              required
            />
          </div>

          {/* Display Pages with Available Actions */}
          <h3 className="text-xl font-bold mb-2">Permissions</h3>

          <div className="flex flex-wrap">
            {/* First Column */}
            <div
              className={`w-full  ${
                secondColumnPages.length
                  ? 'md:w-1/2 border-r border-gray-300 '
                  : 'w-full'
              }`}
            >
              {firstColumnPages.map((page) => {
                const isPageSelected = !!selectedPermissions[page.name]
                return (
                  <div key={page.name} className="mb-2 border-b pb-2 mx-2">
                    {/* Page Checkbox */}
                    <label className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={isPageSelected}
                        onChange={() => handlePageSelection(page.name)}
                      />
                      <span className="text-lg font-semibold">{page.name}</span>
                    </label>

                    {/* Actions Checkboxes (enabled only if page is selected) */}
                    <div
                      className={`flex flex-wrap ${
                        isPageSelected ? '' : 'opacity-50 pointer-events-none'
                      }`}
                    >
                      {page.available_actions.split(',').map((action) => (
                        <label
                          key={action}
                          className="mr-4 mb-2 flex items-center"
                        >
                          <input
                            type="checkbox"
                            className="mr-2"
                            disabled={!isPageSelected}
                            checked={
                              selectedPermissions[page.name]?.includes(
                                action,
                              ) || false
                            }
                            onChange={() =>
                              handleActionChange(page.name, action)
                            }
                          />
                          {action}
                        </label>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Second Column (if applicable) */}
            {secondColumnPages.length > 0 && (
              <div className="w-full md:w-1/2">
                {secondColumnPages.map((page) => {
                  const isPageSelected = !!selectedPermissions[page.name]
                  return (
                    <div key={page.name} className="mb-2 border-b pb-2 mx-2">
                      {/* Page Checkbox */}
                      <label className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={isPageSelected}
                          onChange={() => handlePageSelection(page.name)}
                        />
                        <span className="text-lg font-semibold">
                          {page.name}
                        </span>
                      </label>

                      {/* Actions Checkboxes (enabled only if page is selected) */}
                      <div
                        className={`flex flex-wrap ${
                          isPageSelected ? '' : 'opacity-50 pointer-events-none'
                        }`}
                      >
                        {page.available_actions.split(',').map((action) => (
                          <label
                            key={action}
                            className="mr-4 mb-2 flex items-center"
                          >
                            <input
                              type="checkbox"
                              className="mr-2"
                              disabled={!isPageSelected}
                              checked={
                                selectedPermissions[page.name]?.includes(
                                  action,
                                ) || false
                              }
                              onChange={() =>
                                handleActionChange(page.name, action)
                              }
                            />
                            {action}
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Role
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRoleModal
