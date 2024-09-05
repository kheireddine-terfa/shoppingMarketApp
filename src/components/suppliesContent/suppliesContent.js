import React, { useEffect, useState } from 'react'
import Table from '../commonComponents/Table'
// import AddProductModal from './relatedComponents/AddProductModal'
import AddModal from '../commonComponents/AddModal'
import ConfirmModal from '../commonComponents/ConfirmModal'
import UpdateModal from '../commonComponents/UpdateModal'
// check the controller :
const SuppliesContent = () => {
  //----------- States:
  const [supplies, setSupplies] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedSupply, setSelectedSupply] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const initialFormData = {
    date: '',
    amount: '',
    description: '',
    paid_amount: '',
    remaining_amount: '',
  }
  const [formData, setFormData] = useState(initialFormData)
  // Fetch supplies from the backend

  const fetchSupplies = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/supplies')
      const data = await response.json()
      console.log('data', data)
      setSupplies(
        data.map((supply) => {
          return {
            id: supply.id,
            amount: supply.amount,
            description: supply.description,
            paid_amount: supply.paid_amount,
            remaining_amount: supply.remaining_amount,
            titleHref: `/supplies/${supply.id}`,
            date: supply.date,
            currentSupply: supply,
          }
        }),
      )
    } catch (error) {
      console.error('Error fetching supplies:', error)
    }
  }
  useEffect(() => {
    fetchSupplies()
  }, [])
  const handleDeleteClick = (supply) => {
    setSelectedSupply(supply) // Ensure the correct supply object is set
    setShowDeleteModal(true)
  }

  // Handle delete
  const handleConfirmDelete = async () => {
    if (!selectedSupply) return // Ensure selectedSupply is set
    try {
      const response = await fetch(
        `http://localhost:3001/api/supplies/${selectedSupply}`,
        {
          // Use template literal with backticks
          method: 'DELETE',
        },
      )
      if (response.ok) {
        // Remove the deleted supply from the state
        setSupplies(supplies.filter((s) => s.id !== selectedSupply))
        setSelectedSupply(null) // Reset selectedSupply after deletion
        setShowDeleteModal(false) // Close the delete modal
      } else {
        console.error('Failed to delete supply')
      }
    } catch (error) {
      console.error('Error deleting supply:', error)
    }
  }

  // Handle delete all supplies
  const handleDeleteAll = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/supplies', {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchSupplies() // Re-fetch supplies after all are deleted
        setShowConfirmModal(false) // Close the modal
      } else {
        console.error('Failed to delete all supplies')
      }
    } catch (error) {
      console.error('Error deleting all supplies:', error)
    }
  }
  // Handle add supply
  const handleAddSupply = async (newSupply) => {
    try {
      const formData = {
        date: newSupply.date,
        amount: newSupply.amount,
        description: newSupply.description,
        paid_amount: newSupply.paid_amount,
        remaining_amount: newSupply.remaining_amount,
      }

      const response = await fetch('http://localhost:3001/api/supplies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send the FormData
      })
      if (response.ok) {
        const addedSupply = await response.json()

        // Update the state with the new supply including its
        const updatedSupply = {
          id: addedSupply.id,
          titleHref: `/supplies/${addedSupply.id}`,
          date: addedSupply.date,
          amount: addedSupply.amount,
          description: addedSupply.description,
          paid_amount: addedSupply.paid_amount,
          remaining_amount: addedSupply.remaining_amount,
        }
        setSupplies((prevSupplies) => [...prevSupplies, updatedSupply])
        fetchSupplies()
        setShowModal(false)
        // Reset form data after adding a supply
        setFormData(initialFormData)
      } else {
        console.error('Failed to add the supply')
      }
    } catch (error) {
      console.error('Error adding supply:', error)
    }
  }
  const handleUpdate = async (updatedSupply) => {
    try {
      // Create a FormData object to handle the file upload and other data
      const formData = {
        date: updatedSupply.date,
        amount: updatedSupply.amount,
        description: updatedSupply.description,
        paid_amount: updatedSupply.paid_amount,
        remaining_amount: updatedSupply.remaining_amount,
      }
      // Send the updated data to the backend
      const response = await fetch(
        `http://localhost:3001/api/supplies/${updatedSupply.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      )

      if (!response.ok) {
        throw new Error('Failed to update the supply')
      } else {
        fetchSupplies()
        setShowUpdateModal(false)
        setFormData(initialFormData)
      }

      const result = await response.json()
      console.log('supply updated successfully:', result)

      // Add any further logic if needed, such as updating the UI or notifying the user
    } catch (error) {
      console.error('Error updating supply:', error)
      // Handle the error, e.g., show an error message to the user
    }
  }
  const handleSubmit = (event) => {
    event.preventDefault()

    const updatedSupply = {
      id: selectedSupply.id, // The ID of the supply being updated
      date: formData.date,
      amount: formData.amount,
      description: formData.description,
      paid_amount: formData.paid_amount,
      remaining_amount: formData.remaining_amount,
    }

    handleUpdate(updatedSupply)
  }
  const handleUpdateSupply = (supply) => {
    setSelectedSupply(supply)
    console.log('supply :', supply)
    setFormData({
      date: supply.date,
      amount: supply.amount,
      description: supply.description,
      paid_amount: supply.paid_amount,
      remaining_amount: supply.remaining_amount,
    })
    setShowUpdateModal(true)
  }

  const handleCancelUpdate = () => {
    setShowUpdateModal(false)
    setSelectedSupply(null)
  }
  // Filter supplies searching :
  const filteredSupplies = supplies.filter((supply) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      (supply.date && supply.date.toLowerCase().includes(searchLower)) ||
      (supply.amount && supply.amount.toLowerCase().includes(searchLower)) ||
      (supply.description.toString() &&
        supply.description.toString().toLowerCase().includes(searchLower))
    )
  })
  console.log('filteredSupplies', filteredSupplies)
  const actions = {
    onDelete: handleDeleteClick,
    onUpdate: handleUpdateSupply,
  }
  const handleAddSubmit = (e) => {
    console.log('form data', formData)
    e.preventDefault()
    const newSupply = {
      date: formData.date,
      amount: formData.amount,
      description: formData.description,
      paid_amount: formData.paid_amount,
      remaining_amount: formData.remaining_amount,
    }
    handleAddSupply(newSupply)
  }
  const InputsConfig = [
    {
      label: 'Supply Date',
      type: 'date',
      value: formData.date,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          date: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Supply Amount',
      value: formData.amount,
      type: 'number',
      min: 1,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          amount: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Supply Description',
      value: formData.description,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          description: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Paid Amount',
      type: 'number',
      min: 1,
      value: formData.paid_amount,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          paid_amount: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Remaining Amount',
      type: 'number',
      min: 1,
      value: formData.remaining_amount,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          remaining_amount: e.target.value,
        })),
      required: true,
    },
  ]
  const headerConfig = [
    {
      title: 'Supply Date',
      class: 'pb-3 text-start min-w-[20%]',
    },
    {
      title: 'amount',
      class: 'pb-3 text-start min-w-[20%]',
    },
    {
      title: 'Description',
      class: 'pb-3 text-start min-w-[20%]',
    },
    {
      title: 'Paid Amount',
      class: 'pb-3 text-start min-w-[20%]',
    },
    {
      title: 'Remaining Amount',
      class: 'pb-3 text-start min-w-[20%]',
    },
    {
      title: 'Manage',
      class: 'pb-3 pr-12 text-end min-w-[20%]',
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
                  Tous Les Fournisseur
                </span>
              </h3>
              <div className="relative flex items-center my-2 border rounded-lg h-[40px] ml-auto min-w-[50%]">
                <input
                  type="text"
                  placeholder="Search supplies..."
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
                  Add New Supply
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
              data={filteredSupplies}
              actions={actions}
              headerConfig={headerConfig}
              tableTitle={'supplies'}
            />
          </div>
        </div>
      </div>
      {showModal && (
        <AddModal
          onSubmit={handleAddSubmit}
          onCancel={() => setShowModal(false)}
          InputsConfig={InputsConfig}
          title={'Supply'}
        />
      )}
      {showDeleteModal && (
        <ConfirmModal
          title="Delete Supply"
          message={`Are you sure you want to delete this Supply?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete all supplies?"
          onConfirm={handleDeleteAll}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      {showUpdateModal && selectedSupply && (
        <UpdateModal
          title="Supply"
          InputsConfig={InputsConfig}
          onSubmit={handleSubmit}
          onCancel={handleCancelUpdate}
        />
      )}
    </main>
  )
}

export default SuppliesContent
