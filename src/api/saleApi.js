import { initialFormData } from '../utilities/supplierUtils'
export const fetchSales = async (setSales) => {
  try {
    const response = await fetch('http://localhost:3001/api/product-sales')
    const data = await response.json()
    setSales(
      data.map((sale) => {
        return {
          id: sale.id,
          date: sale.date,
          description: sale.description,
          amount: sale.amount,
          paid_amount: sale.paid_amount,
          remaining_amount: sale.remaining_amount,
          currentSale: sale,
        }
      }),
    )
  } catch (error) {
    console.error('Error fetching sales:', error)
  }
}
export const fetchProducts = async (selectedSale, setProducts) => {
  if (!selectedSale) return
  try {
    const response = await fetch(
      `http://localhost:3001/api/product-sales/${selectedSale.id}`,
    )
    const data = await response.json()
    setProducts(
      data.map((item) => {
        return {
          id: item.Product.id,
          productName: item.Product.name,
          productPrice: item.Product.price,
          saleQuantity: item.quantity,
          isBalanced: item.Product.balanced_product,
        }
      }),
    ) // Assuming the API returns an array of products with their sold quantity
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

export const handleUpdate = async (
  updatedSale,
  setSales,
  setShowUpdateModal,
  setFormData,
  setIsUpdate,
) => {
  try {
    // Create a FormData object to handle the file upload and other data
    const formData = {
      date: updatedSale.sale,
      amount: updatedSale.amount,
      description: updatedSale.description,
      paid_amount: updatedSale.paid_amount,
      remaining_amount: updatedSale.remaining_amount,
    }
    // Send the updated data to the backend
    const response = await fetch(
      `http://localhost:3001/api/sales/${updatedSale.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      },
    )

    if (!response.ok) {
      throw new Error('Failed to update the sale')
    } else {
      fetchSales(setSales)
      setShowUpdateModal(false)
      setFormData(initialFormData)
      setIsUpdate(false) // Set update flag to false
    }

    const result = await response.json()
    console.log('sale updated successfully:', result)

    // Add any further logic if needed, such as updating the UI or notifying the user
  } catch (error) {
    console.error('Error updating sale:', error)
    // Handle the error, e.g., show an error message to the user
  }
}
export const handleSubmit = (
  e,
  formData,
  setSales,
  setShowUpdateModal,
  setFormData,
  selectedSale,
  setIsUpdate,
) => {
  e.preventDefault()

  const updatedSale = {
    id: selectedSale.id, // The ID of the sale being updated
    date: formData.date,
    amount: formData.amount,
    description: formData.description,
    paid_amount: formData.paid_amount,
    remaining_amount: formData.remaining_amount,
  }

  handleUpdate(
    updatedSale,
    setSales,
    setShowUpdateModal,
    setFormData,
    selectedSale,
    setIsUpdate,
  )
}
// handel delete all suppliers
export const handleDeleteAll = async (setSales, setShowConfirmModal) => {
  try {
    const response = await fetch('http://localhost:3001/api/sales', {
      method: 'DELETE',
    })

    if (response.ok) {
      fetchSales(setSales) // Re-fetch sales after all are deleted
      setShowConfirmModal(false) // Close the modal
    } else {
      console.error('Failed to delete all sales')
    }
  } catch (error) {
    console.error('Error deleting all sales:', error)
  }
}
// handle delete supplier :

export const handleConfirmDelete = async (
  selectedSale,
  setSales,
  sales,
  setSelectedSale,
  setShowDeleteModal,
) => {
  if (!selectedSale) return // Ensure selectedSale is set
  try {
    const response = await fetch(
      `http://localhost:3001/api/sales/${selectedSale}`,
      {
        // Use template literal with backticks
        method: 'DELETE',
      },
    )
    if (response.ok) {
      // Remove the deleted sale from the state
      setSales(sales.filter((s) => s.id !== selectedSale))
      setSelectedSale(null) // Reset selectedSale after deletion
      setShowDeleteModal(false) // Close the delete modal
    } else {
      console.error('Failed to delete sale')
    }
  } catch (error) {
    console.error('Error deleting sale:', error)
  }
}