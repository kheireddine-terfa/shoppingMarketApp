import { initialFormData } from '../utilities/expenseUtils'
export const fetchExpenses = async (setExpenses) => {
  try {
    const response = await fetch('http://localhost:3001/api/expenses')
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
      fetchExpenses(setExpenses)
      setShowModal(false)
      // Reset form data after adding a expense
      setFormData(initialFormData)
    } else {
      console.error('Failed to add the expense')
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
) => {
  e.preventDefault()
  const newExpense = {
    date: formData.date,
    amount: formData.amount,
    description: formData.description,
  }
  handleAddSupplier(newExpense, setExpenses, setShowModal, setFormData)
}

export const handleUpdate = async (
  updatedExpense,
  setExpenses,
  setShowUpdateModal,
  setFormData,
  setIsUpdate,
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
      throw new Error('Failed to update the expense')
    } else {
      fetchExpenses(setExpenses)
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
  )
}
// handel delete all suppliers
export const handleDeleteAll = async (setExpenses, setShowConfirmModal) => {
  try {
    const response = await fetch('http://localhost:3001/api/expenses', {
      method: 'DELETE',
    })

    if (response.ok) {
      fetchExpenses(setExpenses) // Re-fetch expenses after all are deleted
      setShowConfirmModal(false) // Close the modal
    } else {
      console.error('Failed to delete all expenses')
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
      console.error('Failed to delete expense')
    }
  } catch (error) {
    console.error('Error deleting expense:', error)
  }
}
