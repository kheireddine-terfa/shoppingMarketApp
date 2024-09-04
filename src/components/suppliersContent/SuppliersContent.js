import React, { useEffect, useState } from 'react'
import Table from '../commonComponents/Table'
// import AddProductModal from './relatedComponents/AddProductModal'
import AddModal from '../commonComponents/AddModal'
import ConfirmModal from '../commonComponents/ConfirmModal'
import UpdateModal from '../commonComponents/UpdateModal'
// check the controller :
const SuppliersContent = () => {
  //----------- States:
  const [suppliers, setSuppliers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const initialFormData = {
    name: '',
    address: '',
    phone_number: '',
  }
  const [formData, setFormData] = useState(initialFormData)
  // Fetch suppliers from the backend

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/suppliers')
      const data = await response.json()
      setSuppliers(
        data.map((supplier) => {
          return {
            id: supplier.id,
            address: supplier.address,
            phone_number: supplier.phone_number,
            titleHref: `/suppliers/${supplier.id}`,
            title: supplier.name,
            currentSupplier: supplier,
          }
        }),
      )
    } catch (error) {
      console.error('Error fetching suppliers:', error)
    }
  }
  useEffect(() => {
    fetchSuppliers()
  }, [])
  const handleDeleteClick = (supplier) => {
    setSelectedSupplier(supplier) // Ensure the correct supplier object is set
    setShowDeleteModal(true)
  }

  // Handle delete
  const handleConfirmDelete = async () => {
    if (!selectedSupplier) return // Ensure selectedSupplier is set
    try {
      const response = await fetch(
        `http://localhost:3001/api/suppliers/${selectedSupplier}`,
        {
          // Use template literal with backticks
          method: 'DELETE',
        },
      )
      if (response.ok) {
        // Remove the deleted supplier from the state
        setSuppliers(suppliers.filter((s) => s.id !== selectedSupplier))
        setSelectedSupplier(null) // Reset selectedSupplier after deletion
        setShowDeleteModal(false) // Close the delete modal
      } else {
        console.error('Failed to delete supplier')
      }
    } catch (error) {
      console.error('Error deleting supplier:', error)
    }
  }

  // Handle delete all suppliers
  const handleDeleteAll = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/suppliers', {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchSuppliers() // Re-fetch suppliers after all are deleted
        setShowConfirmModal(false) // Close the modal
      } else {
        console.error('Failed to delete all suppliers')
      }
    } catch (error) {
      console.error('Error deleting all suppliers:', error)
    }
  }
  // Handle add supplier
  const handleAddSupplier = async (newSupplier) => {
    try {
      const formData = {
        name: newSupplier.name,
        address: newSupplier.address,
        phone_number: newSupplier.phone_number,
      }

      const response = await fetch('http://localhost:3001/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send the FormData
      })
      if (response.ok) {
        const addedSupplier = await response.json()

        // Update the state with the new supplier including its
        const updatedSupplier = {
          id: addedSupplier.id,
          titleHref: `/suppliers/${addedSupplier.id}`,
          title: addedSupplier.name,
          address: addedSupplier.address,
          phone_number: addedSupplier.phone_number,
        }
        setSuppliers((prevSuppliers) => [...prevSuppliers, updatedSupplier])
        fetchSuppliers()
        setShowModal(false)
        // Reset form data after adding a supplier
        setFormData(initialFormData)
      } else {
        console.error('Failed to add the supplier')
      }
    } catch (error) {
      console.error('Error adding supplier:', error)
    }
  }
  const handleUpdate = async (updatedSupplier) => {
    try {
      // Create a FormData object to handle the file upload and other data
      const formData = {
        name: updatedSupplier.name,
        address: updatedSupplier.address,
        phone_number: updatedSupplier.phone_number,
      }
      // Send the updated data to the backend
      const response = await fetch(
        `http://localhost:3001/api/suppliers/${updatedSupplier.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      )

      if (!response.ok) {
        throw new Error('Failed to update the supplier')
      } else {
        fetchSuppliers()
        setShowUpdateModal(false)
        setFormData(initialFormData)
      }

      const result = await response.json()
      console.log('supplier updated successfully:', result)

      // Add any further logic if needed, such as updating the UI or notifying the user
    } catch (error) {
      console.error('Error updating supplier:', error)
      // Handle the error, e.g., show an error message to the user
    }
  }
  const handleSubmit = (event) => {
    event.preventDefault()

    const updatedSupplier = {
      id: selectedSupplier.id, // The ID of the supplier being updated
      name: formData.name,
      address: formData.address,
      phone_number: formData.phone_number,
    }

    handleUpdate(updatedSupplier)
  }
  const handleUpdateSupplier = (supplier) => {
    setSelectedSupplier(supplier)
    console.log('supplier :', supplier)
    setFormData({
      name: supplier.name,
      address: supplier.address,
      phone_number: supplier.phone_number,
    })
    setShowUpdateModal(true)
  }

  const handleCancelUpdate = () => {
    setShowUpdateModal(false)
    setSelectedSupplier(null)
  }
  // Filter suppliers searching :
  const filteredSuppliers = suppliers.filter((supplier) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      (supplier.title && supplier.title.toLowerCase().includes(searchLower)) ||
      (supplier.address &&
        supplier.address.toLowerCase().includes(searchLower)) ||
      (supplier.phone_number.toString() &&
        supplier.phone_number.toString().toLowerCase().includes(searchLower))
    )
  })
  const actions = {
    onDelete: handleDeleteClick,
    onUpdate: handleUpdateSupplier,
  }
  const handleAddSubmit = (e) => {
    console.log('form data', formData)
    e.preventDefault()
    const newSupplier = {
      name: formData.name,
      address: formData.address,
      phone_number: formData.phone_number,
    }
    handleAddSupplier(newSupplier)
  }
  const InputsConfig = [
    {
      label: 'Supplier Name',
      value: formData.name,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          name: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Supplier Address',
      value: formData.address,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          address: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Supplier Phone Number',
      value: formData.phone_number,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          phone_number: e.target.value,
        })),
      required: true,
    },
  ]
  const headerConfig = [
    {
      title: 'Supplier Name',
      class: 'pb-3 text-start min-w-[25%]',
    },
    {
      title: 'Address',
      class: 'pb-3 text-start min-w-[25%]',
    },
    {
      title: 'Phone Number',
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
                  Tous Les Fournisseur
                </span>
              </h3>
              <div className="relative flex items-center my-2 border rounded-lg h-[40px] ml-auto min-w-[50%]">
                <input
                  type="text"
                  placeholder="Search suppliers..."
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
                  Add New Supplier
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
              data={filteredSuppliers}
              actions={actions}
              headerConfig={headerConfig}
              tableTitle={'suppliers'}
            />
          </div>
        </div>
      </div>
      {showModal && (
        <AddModal
          onSubmit={handleAddSubmit}
          onCancel={() => setShowModal(false)}
          InputsConfig={InputsConfig}
          title={'Supplier'}
        />
      )}
      {showDeleteModal && (
        <ConfirmModal
          title="Delete Supplier"
          message={`Are you sure you want to delete this Supplier?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete all suppliers?"
          onConfirm={handleDeleteAll}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      {showUpdateModal && selectedSupplier && (
        // <UpdateModal
        //   onSubmit={handleUpdateSubmit}
        //   onCancel={handleCancelUpdate}
        // />
        <UpdateModal
          title="Supplier"
          InputsConfig={InputsConfig}
          onSubmit={handleSubmit}
          onCancel={handleCancelUpdate}
        />
      )}
    </main>
  )
}

export default SuppliersContent
