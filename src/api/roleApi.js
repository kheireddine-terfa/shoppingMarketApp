// import { initialFormData } from '../utilities/roleUtils'
import { fetchRoles } from './commonApi'
export const handleAddSubmit = async (
  roleData,
  setErrorMessage,
  setShowErrorPopup,
  setRoles,
  setShowModal,
) => {
  try {
    const token = sessionStorage.getItem('token')
    const response = await fetch('http://localhost:3001/api/roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

        Authorization: `Bearer ${token}`, // Send the token
      },
      body: JSON.stringify(roleData),
    })

    if (!response.ok) {
      const errorData = await response.json() // Parse the error message
      setErrorMessage(errorData.message || 'Failed to add the role')
      setShowErrorPopup(true)
      return
    }

    const result = await response.json()
    fetchRoles(setRoles, setErrorMessage, setShowErrorPopup)
    setShowModal(false)

    console.log('Role created successfully:', result)
  } catch (error) {
    console.error('Error Adding Role :', error)
  }
}
export const handleConfirmDelete = async (
  selectedRole,
  setRoles,
  roles,
  setSelectedRole,
  setShowDeleteModal,
  setErrorMessage,
  setShowErrorPopup,
) => {
  if (!selectedRole) return // Ensure selectedRole is set
  try {
    const token = sessionStorage.getItem('token')
    const response = await fetch(
      `http://localhost:3001/api/roles/${selectedRole}`,
      {
        // Use template literal with backticks
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // Send the token
        },
      },
    )
    if (response.ok) {
      // Remove the deleted role from the state
      setRoles(roles.filter((c) => c.id !== selectedRole))
      setSelectedRole(null) // Reset selectedRole after deletion
      setShowDeleteModal(false) // Close the delete modal
    } else {
      const errorData = await response.json() // Parse the error message
      setErrorMessage(errorData.message || 'Failed to delete the role')
      setShowErrorPopup(true)
      return
    }
  } catch (error) {
    console.error('Error deleting role:', error)
  }
}
// handel delete all suppliers
export const handleDeleteAll = async (
  setRoles,
  setShowConfirmModal,
  setErrorMessage,
  setShowErrorPopup,
) => {
  try {
    const token = sessionStorage.getItem('token')
    const response = await fetch('http://localhost:3001/api/roles', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`, // Send the token
      },
    })

    if (response.ok) {
      fetchRoles(setRoles, setErrorMessage, setShowErrorPopup) // Re-fetch roles after all are deleted
      setShowConfirmModal(false) // Close the modal
    } else {
      const errorData = await response.json() // Parse the error message
      setErrorMessage(errorData.message || 'Failed to delete all roles')
      setShowErrorPopup(true)
      return
    }
  } catch (error) {
    console.error('Error deleting all roles:', error)
  }
}
export const handleSubmit = async (
  roleData,
  setRoles,
  setShowUpdateModal,
  setErrorMessage,
  setShowErrorPopup,
) => {
  try {
    const token = sessionStorage.getItem('token')
    const response = await fetch(
      `http://localhost:3001/api/roles/${roleData.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Send the token
        },
        body: JSON.stringify(roleData),
      },
    )

    if (!response.ok) {
      const errorData = await response.json() // Parse the error message
      setErrorMessage(errorData.message || 'Failed to update the role')
      setShowErrorPopup(true)
      return
    } else {
      fetchRoles(setRoles, setErrorMessage, setShowErrorPopup)
      setShowUpdateModal(false)
    }

    const result = await response.json()
    console.log(result)
  } catch (error) {
    console.error('Error updating role:', error)
    // Handle the error, e.g., show an error message to the user
  }
}
