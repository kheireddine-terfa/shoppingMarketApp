import { initialFormData } from '../utilities/expenseUtils'
export const fetchExpenses = async (
  setExpenses,
  setErrorMessage,
  setShowErrorPopup,
) => {
  try {
    const response = await fetch('http://localhost:3001/api/expenses')
    if (!response.ok) {
      setErrorMessage('Failed to fetch expenses , please try again later.')
      setShowErrorPopup(true)
      return
    }
    const data = await response.json()
    setExpenses(
      data.map((expense) => {
        return {
          id: expense.id,
          date: expense.date,
          description: expense.description,
          amount: expense.amount,
          currentExpense: expense,
        }
      }),
    )
  } catch (error) {
    console.error('Error fetching expenses:', error)
  }
}

// Handle add product
export const handleAddSupplier = async (
  newExpense,
  setExpenses,
  setShowModal,
  setFormData,
  setErrorMessage,
  setShowErrorPopup,
) => {
  try {
    if (!newExpense) return
    const formData = {
      date: newExpense.date,
      amount: newExpense.amount,
      description: newExpense.description,
    }

    const response = await fetch('http://localhost:3001/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData), // Send the FormData
    })
    if (response.ok) {
      const addedExpense = await response.json()

      // Update the state with the new expense including its
      const updatedExpense = {
        id: addedExpense.id,
        date: addedExpense.date,
        amount: addedExpense.amount,
        description: addedExpense.description,
      }
      setExpenses((prevExpenses) => [...prevExpenses, updatedExpense])
      fetchExpenses(setExpenses, setErrorMessage, setShowErrorPopup)
      setShowModal(false)
      // Reset form data after adding a expense
      setFormData(initialFormData)
    } else {
      const errorData = await response.json() // Parse the error message
      setErrorMessage(errorData.message || 'Failed to add the expense')
      setShowErrorPopup(true)
      return
    }
  } catch (error) {
    console.error('Error adding expense:', error)
  }
}
export const handleAddSubmit = (
  e,
  formData,
  setExpenses,
  setShowModal,
  setFormData,
  setErrorMessage,
  setShowErrorPopup,
) => {
  e.preventDefault()
  const newExpense = {
    date: formData.date,
    amount: formData.amount,
    description: formData.description,
  }
  handleAddSupplier(
    newExpense,
    setExpenses,
    setShowModal,
    setFormData,
    setErrorMessage,
    setShowErrorPopup,
  )
}

export const handleUpdate = async (
  updatedExpense,
  setExpenses,
  setShowUpdateModal,
  setFormData,
  setIsUpdate,
  setErrorMessage,
  setShowErrorPopup,
) => {
  try {
    // Create a FormData object to handle the file upload and other data
    const formData = {
      date: updatedExpense.date,
      amount: updatedExpense.amount,
      description: updatedExpense.description,
    }
    // Send the updated data to the backend
    const response = await fetch(
      `http://localhost:3001/api/expenses/${updatedExpense.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      },
    )

    if (!response.ok) {
      const errorData = await response.json() // Parse the error message
      setErrorMessage(errorData.message || 'Failed to update the expense')
      setShowErrorPopup(true)
      return
    } else {
      fetchExpenses(setExpenses, setErrorMessage, setShowErrorPopup)
      setShowUpdateModal(false)
      setFormData(initialFormData)
      setIsUpdate(false) // Set update flag to false
    }

    const result = await response.json()
    console.log('expense updated successfully:', result)

    // Add any further logic if needed, such as updating the UI or notifying the user
  } catch (error) {
    console.error('Error updating expense:', error)
    // Handle the error, e.g., show an error message to the user
  }
}
export const handleSubmit = (
  e,
  formData,
  setExpenses,
  setShowUpdateModal,
  setFormData,
  selectedExpense,
  setIsUpdate,
  setErrorMessage,
  setShowErrorPopup,
) => {
  e.preventDefault()

  const updatedExpense = {
    id: selectedExpense.id, // The ID of the expense being updated
    date: formData.date,
    amount: formData.amount,
    description: formData.description,
  }

  handleUpdate(
    updatedExpense,
    setExpenses,
    setShowUpdateModal,
    setFormData,
    setIsUpdate,
    setErrorMessage,
    setShowErrorPopup,
  )
}
// handel delete all suppliers
export const handleDeleteAll = async (
  setExpenses,
  setShowConfirmModal,
  setErrorMessage,
  setShowErrorPopup,
) => {
  try {
    const response = await fetch('http://localhost:3001/api/expenses', {
      method: 'DELETE',
    })

    if (response.ok) {
      fetchExpenses(setExpenses, setErrorMessage, setShowErrorPopup) // Re-fetch expenses after all are deleted
      setShowConfirmModal(false) // Close the modal
    } else {
      const errorData = await response.json() // Parse the error message
      setErrorMessage(errorData.message || 'Failed to delete all expenses')
      setShowErrorPopup(true)
      return
    }
  } catch (error) {
    console.error('Error deleting all expenses:', error)
  }
}
// handle delete supplier :

export const handleConfirmDelete = async (
  selectedExpense,
  setExpenses,
  expenses,
  setSelectedExpense,
  setShowDeleteModal,
  setErrorMessage,
  setShowErrorPopup,
) => {
  if (!selectedExpense) return // Ensure selectedExpense is set
  try {
    const response = await fetch(
      `http://localhost:3001/api/expenses/${selectedExpense}`,
      {
        // Use template literal with backticks
        method: 'DELETE',
      },
    )
    if (response.ok) {
      // Remove the deleted expense from the state
      setExpenses(expenses.filter((e) => e.id !== selectedExpense))
      setSelectedExpense(null) // Reset selectedExpense after deletion
      setShowDeleteModal(false) // Close the delete modal
    } else {
      const errorData = await response.json() // Parse the error message
      setErrorMessage(errorData.message || 'Failed to delete the expense')
      setShowErrorPopup(true)
      return
    }
  } catch (error) {
    console.error('Error deleting expense:', error)
  }
}
