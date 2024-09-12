import React, { useEffect, useState } from 'react'
import Table from '../commonComponents/Table'
import ConfirmModal from '../commonComponents/ConfirmModal'
import UpdateModal from '../commonComponents/UpdateModal'
import AddModal from '../commonComponents/AddModal'

// import './style.css'
// check the controller :
const Expensescontent = () => {
  //----------- States:
  const [expenses, setExpenses] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false) // Flag to determine if the form is for update or add
  const initialFormData = {
    date: '',
    amount: '',
    description: '',
  }
  const [formData, setFormData] = useState(initialFormData)
  // Fetch expenses from the backend

  const fetchExpenses = async () => {
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
  useEffect(() => {
    fetchExpenses()
  }, [])
  const handleDeleteClick = (expense) => {
    setSelectedExpense(expense) // Ensure the correct expense object is set
    setShowDeleteModal(true)
  }
  // Handle add expense
  const handleAddExpense = async (newExpense) => {
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
        fetchExpenses()
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
  const handleAddSubmit = (e) => {
    e.preventDefault()
    const newExpense = {
      date: formData.date,
      amount: formData.amount,
      description: formData.description,
    }
    handleAddExpense(newExpense)
  }
  // Handle delete
  const handleConfirmDelete = async () => {
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

  // Handle delete all expenses
  const handleDeleteAll = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/expenses', {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchExpenses() // Re-fetch expenses after all are deleted
        setShowConfirmModal(false) // Close the modal
      } else {
        console.error('Failed to delete all expenses')
      }
    } catch (error) {
      console.error('Error deleting all expenses:', error)
    }
  }
  const handleUpdate = async (updatedExpense) => {
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
        fetchExpenses()
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
  const handleSubmit = (event) => {
    event.preventDefault()

    const updatedExpense = {
      id: selectedExpense.id, // The ID of the expense being updated
      date: formData.date,
      amount: formData.amount,
      description: formData.description,
    }

    handleUpdate(updatedExpense)
  }
  const handleUpdateExpense = (expense) => {
    setSelectedExpense(expense)
    setFormData({
      date: expense.date,
      description: expense.description,
      amount: expense.amount,
    })
    setShowUpdateModal(true)
    setIsUpdate(true) // Set update flag to true
  }

  const handleCancelUpdate = () => {
    setShowUpdateModal(false)
    setSelectedExpense(null)
    setIsUpdate(false) // Reset the update flag
  }

  // Filter expenses searching :
  const filteredExpenses = expenses.filter((expense) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      (expense.date && expense.date.toLowerCase().includes(searchLower)) ||
      (expense.amount &&
        expense.amount.toString().toLowerCase().includes(searchLower)) ||
      (expense.description &&
        expense.description.toString().toLowerCase().includes(searchLower))
    )
  })
  const actions = {
    onDelete: handleDeleteClick,
    onUpdate: handleUpdateExpense,
  }

  const InputsConfig = [
    {
      label: 'Date',
      value: formData.date,
      type: 'date',
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          date: e.target.value,
        })),
      required: !isUpdate, // Only required if it's not an update,
    },
    {
      label: 'Amount',
      value: formData.amount,
      type: 'number',
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          amount: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Description',
      value: formData.description,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          description: e.target.value,
        })),
      required: true,
    },
  ]
  const headerConfig = [
    {
      title: 'Date',
      class: 'pb-3 text-start min-w-[25%]',
    },
    {
      title: 'Description',
      class: 'pb-3 text-start min-w-[25%]',
    },
    {
      title: 'Amount',
      class: 'pb-3 text-start min-w-[25%]',
    },
    {
      title: 'Manage',
      class: 'pb-3 pr-12 text-end min-w-[25%]',
    },
  ]
  return (
    <main className="container mx-auto p-4 mt-[52px] flex flex-wrap mb-5">
      <div className="w-full max-w-full px-3 mb-6 mx-auto">
        <div className="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white m-5">
          <div className="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30">
            <div className="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
              <h3 className="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark">
                <span className="mr-3 font-semibold text-dark">
                  Tous Les Dépenses
                </span>
              </h3>
              <div className="relative flex items-center my-2 border rounded-lg h-[40px] ml-auto min-w-[50%]">
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full px-4 py-2 text-sm border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35m2.7-5.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="relative flex flex-wrap justify-end items-center my-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  Add New Expense
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)} // Show the confirmation modal
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Delete All
                </button>
              </div>
            </div>
            <Table
              data={filteredExpenses}
              actions={actions}
              headerConfig={headerConfig}
              tableTitle={'expenses'}
            />
          </div>
        </div>
      </div>
      {showModal && (
        <AddModal
          onSubmit={handleAddSubmit}
          onCancel={() => setShowModal(false)}
          InputsConfig={InputsConfig}
          title={'Expense'}
        />
      )}

      {showDeleteModal && (
        <ConfirmModal
          title="Delete Expense"
          message={`Are you sure you want to delete this expense?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete all expenses?"
          onConfirm={handleDeleteAll}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      {showUpdateModal && selectedExpense && (
        <UpdateModal
          title="Expense"
          InputsConfig={InputsConfig}
          onSubmit={handleSubmit}
          onCancel={handleCancelUpdate}
        />
      )}
    </main>
  )
}

export default Expensescontent
