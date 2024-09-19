import { initialFormData } from '../utilities/supplierUtils'
export const fetchSuppliers = async (setSuppliers) => {
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

// Handle add product
export const handleAddSupplier = async (
  newSupplier,
  setSuppliers,
  setShowModal,
  setFormData,
) => {
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
      fetchSuppliers(setSuppliers)
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
export const handleAddSubmit = (
  e,
  formData,
  setSuppliers,
  setShowModal,
  setFormData,
) => {
  e.preventDefault()
  e.preventDefault()
  const newSupplier = {
    name: formData.name,
    address: formData.address,
    phone_number: formData.phone_number,
  }
  handleAddSupplier(newSupplier, setSuppliers, setShowModal, setFormData)
}

export const handleUpdate = async (
  updatedSupplier,
  setSuppliers,
  setShowUpdateModal,
  setFormData,
) => {
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
      fetchSuppliers(setSuppliers)
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
export const handleSubmit = (
  e,
  formData,
  setSuppliers,
  setShowUpdateModal,
  setFormData,
  selectedSupplier,
) => {
  e.preventDefault()

  const updatedSupplier = {
    id: selectedSupplier.id, // The ID of the supplier being updated
    name: formData.name,
    address: formData.address,
    phone_number: formData.phone_number,
  }

  handleUpdate(
    updatedSupplier,
    setSuppliers,
    setShowUpdateModal,
    setFormData,
    selectedSupplier,
  )
}
// handel delete all suppliers
export const handleDeleteAll = async (setSuppliers, setShowConfirmModal) => {
  try {
    const response = await fetch('http://localhost:3001/api/suppliers', {
      method: 'DELETE',
    })

    if (response.ok) {
      fetchSuppliers(setSuppliers) // Re-fetch suppliers after all are deleted
      setShowConfirmModal(false) // Close the modal
    } else {
      console.error('Failed to delete all suppliers')
    }
  } catch (error) {
    console.error('Error deleting all suppliers:', error)
  }
}
// handle delete supplier :

export const handleConfirmDelete = async (
  selectedSupplier,
  setSuppliers,
  suppliers,
  setSelectedSupplier,
  setShowDeleteModal,
) => {
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