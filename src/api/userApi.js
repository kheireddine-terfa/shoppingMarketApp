import { initialFormData } from '../utilities/userUtils'
export const fetchUsers = async (
  setUsers,
  setErrorMessage,
  setShowErrorPopup,
) => {
  try {
    const token = sessionStorage.getItem('token')
    const response = await fetch('http://localhost:3001/api/users', {
      headers: {
        Authorization: `Bearer ${token}`, // Send the token
      },
    })
    if (!response.ok) {
      setErrorMessage('Failed to fetch users , please try again later.')
      setShowErrorPopup(true)
      return
    }
    const data = await response.json()
    setUsers(
      data.users.map((user) => {
        return {
          id: user.id,
          username: user.username,
          role: user.role.name,
          role_id: user.role_id,
          currentUser: user,
        }
      }),
    )
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}
// Handle add user
export const handleAddUsers = async (
  newUser,
  setUsers,
  setShowModal,
  setFormData,
  setErrorMessage,
  setShowErrorPopup,
) => {
  try {
    const formData = {
      username: newUser.username,
      password: newUser.passwordConfirm,
      passwordConfirm: newUser.passwordConfirm,
      role_id: newUser.role_id,
    }
    const token = sessionStorage.getItem('token')
    const response = await fetch('http://localhost:3001/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Send the token
      },
      body: JSON.stringify(formData), // Send the FormData
    })
    if (response.ok) {
      const addedUser = await response.json()

      // Update the state with the new user including its
      const updatedUser = {
        id: addedUser.id,
        username: addedUser.username,
        role_id: addedUser.role_id,
      }
      setUsers((prevUsers) => [...prevUsers, updatedUser])
      fetchUsers(setUsers, setErrorMessage, setShowErrorPopup)
      setShowModal(false)
      // Reset form data after adding a user
      setFormData(initialFormData)
    } else {
      const errorData = await response.json() // Parse the error message
      setErrorMessage(errorData.message || 'Failed to add the user')
      setShowErrorPopup(true)
      return
    }
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
export const handleAddSubmit = (
  e,
  formData,
  setUsers,
  setShowModal,
  setFormData,
  setErrorMessage,
  setShowErrorPopup,
) => {
  e.preventDefault()
  const newUser = {
    username: formData.username,
    password: formData.password,
    passwordConfirm: formData.passwordConfirm,
    role_id: formData.role_id,
  }
  handleAddUsers(
    newUser,
    setUsers,
    setShowModal,
    setFormData,
    setErrorMessage,
    setShowErrorPopup,
  )
}

export const handleUpdate = async (
  updatedUser,
  setUsers,
  setShowUpdateModal,
  setIsUpdate,
  setFormData,
  setErrorMessage,
  setShowErrorPopup,
) => {
  try {
    // Create a FormData object to handle the file upload and other data
    const formData = {
      username: updatedUser.username,
      role_id: updatedUser.role_id,
    }
    console.log('formData', formData)
    const token = sessionStorage.getItem('token')
    // Send the updated data to the backend
    const response = await fetch(
      `http://localhost:3001/api/users/${updatedUser.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Send the token
        },
        body: JSON.stringify(formData),
      },
    )

    if (!response.ok) {
      const errorData = await response.json() // Parse the error message
      setErrorMessage(errorData.message || 'Failed to update the user')
      setShowErrorPopup(true)
      return
    } else {
      fetchUsers(setUsers, setErrorMessage, setShowErrorPopup)
      setShowUpdateModal(false)
      setIsUpdate(false)
      setFormData(initialFormData)
    }

    const result = await response.json()
    console.log('user updated successfully:', result)
  } catch (error) {
    console.error('Error updating user:', error)
  }
}
export const handleSubmit = (
  e,
  formData,
  setUsers,
  setShowUpdateModal,
  setIsUpdate,
  setFormData,
  selectedUser,
  setErrorMessage,
  setShowErrorPopup,
) => {
  e.preventDefault()

  const updatedUser = {
    id: selectedUser.id, // The ID of the user being updated
    username: formData.username,
    role_id: formData.role_id,
  }

  handleUpdate(
    updatedUser,
    setUsers,
    setShowUpdateModal,
    setIsUpdate,
    setFormData,
    setErrorMessage,
    setShowErrorPopup,
  )
}
// handel delete all users
export const handleDeleteAll = async (
  setUsers,
  setShowConfirmModal,
  setErrorMessage,
  setShowErrorPopup,
) => {
  try {
    const token = sessionStorage.getItem('token')
    const response = await fetch('http://localhost:3001/api/users', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`, // Send the token
      },
    })

    if (response.ok) {
      fetchUsers(setUsers, setErrorMessage, setShowErrorPopup) // Re-fetch user after all are deleted
      setShowConfirmModal(false) // Close the modal
    } else {
      const errorData = await response.json() // Parse the error message
      setErrorMessage(errorData.message || 'Failed to delete all users')
      setShowErrorPopup(true)
      return
    }
  } catch (error) {
    console.error('Error deleting all user:', error)
  }
}
// handle delete user :

export const handleConfirmDelete = async (
  selectedUser,
  setUsers,
  users,
  setSelectedUser,
  setShowDeleteModal,
  setErrorMessage,
  setShowErrorPopup,
) => {
  if (!selectedUser) return // Ensure selectedUser is set
  try {
    const token = sessionStorage.getItem('token')
    const response = await fetch(
      `http://localhost:3001/api/users/${selectedUser}`,
      {
        // Use template literal with backticks
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // Send the token
        },
      },
    )
    if (response.ok) {
      // Remove the deleted user from the state
      setUsers(users.filter((s) => s.id !== selectedUser))
      setSelectedUser(null) // Reset selectedUser after deletion
      setShowDeleteModal(false) // Close the delete modal
    } else {
      const errorData = await response.json() // Parse the error message
      setErrorMessage(errorData.message || 'Failed to delete the user')
      setShowErrorPopup(true)
      return
    }
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}
