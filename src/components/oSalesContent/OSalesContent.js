import React, { useEffect, useState } from 'react'
import Table from '../commonComponents/Table'
import ConfirmModal from '../commonComponents/ConfirmModal'
import UpdateModal from '../commonComponents/UpdateModal'
import DetailsModal from '../commonComponents/DetailsModal'

// import './style.css'
// check the controller :
const OSalesContent = () => {
  //----------- States:
  const [sales, setSales] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedSale, setSelectedSale] = useState(null)
  const [products, setProducts] = useState([])
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false) // Flag to determine if the form is for update or add
  const initialFormData = {
    date: '',
    amount: '',
    description: '',
    paid_amount: '',
    remaining_amount: '',
  }
  const [formData, setFormData] = useState(initialFormData)
  // Fetch sales from the backend

  const fetchSales = async () => {
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
  useEffect(() => {
    fetchSales()
  }, [])
  useEffect(() => {
    // Fetch the products of the specific sale
    const fetchProducts = async () => {
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

    fetchProducts()
  }, [selectedSale])
  console.log('products :', products)
  const handleShowDetails = (sale) => {
    setSelectedSale(sale)
    setShowDetailsModal(true) // Show the details modal
  }

  const handleCloseDetails = () => {
    setShowDetailsModal(false) // Close the details modal
  }
  const handleDeleteClick = (sale) => {
    setSelectedSale(sale) // Ensure the correct sale object is set
    setShowDeleteModal(true)
  }

  // Handle delete
  const handleConfirmDelete = async () => {
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
        setSales(sales.filter((p) => p.id !== selectedSale))
        setSelectedSale(null) // Reset selectedSale after deletion
        setShowDeleteModal(false) // Close the delete modal
      } else {
        console.error('Failed to delete sale')
      }
    } catch (error) {
      console.error('Error deleting sale:', error)
    }
  }

  // Handle delete all sales
  const handleDeleteAll = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/sales', {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchSales() // Re-fetch sales after all are deleted
        setShowConfirmModal(false) // Close the modal
      } else {
        console.error('Failed to delete all sales')
      }
    } catch (error) {
      console.error('Error deleting all sales:', error)
    }
  }
  const handleUpdate = async (updatedSale) => {
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
        fetchSales()
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
  const handleSubmit = (event) => {
    event.preventDefault()

    const updatedSale = {
      id: selectedSale.id, // The ID of the sale being updated
      date: formData.date,
      amount: formData.amount,
      description: formData.description,
      paid_amount: formData.paid_amount,
      remaining_amount: formData.remaining_amount,
    }

    handleUpdate(updatedSale)
  }
  const handleUpdateSale = (sale) => {
    setSelectedSale(sale)
    setFormData({
      date: sale.date,
      description: sale.description,
      amount: sale.amount,
      paid_amount: sale.paid_amount,
      remaining_amount: sale.remaining_amount,
    })
    setShowUpdateModal(true)
    setIsUpdate(true) // Set update flag to true
  }

  const handleCancelUpdate = () => {
    setShowUpdateModal(false)
    setSelectedSale(null)
    setIsUpdate(false) // Reset the update flag
  }

  // Filter sales searching :
  const filteredSales = sales.filter((sale) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      (sale.date && sale.date.toLowerCase().includes(searchLower)) ||
      (sale.amount &&
        sale.amount.toString().toLowerCase().includes(searchLower)) ||
      (sale.description &&
        sale.description.toString().toLowerCase().includes(searchLower)) ||
      (sale.paid_amount &&
        sale.paid_amount.toString().toLowerCase().includes(searchLower)) ||
      (sale.remaining_amount &&
        sale.remaining_amount.toString().toLowerCase().includes(searchLower))
    )
  })
  const actions = {
    onDelete: handleDeleteClick,
    onUpdate: handleUpdateSale,
    onShowDetails: handleShowDetails,
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
    {
      label: 'Paid Amount',
      value: formData.paid_amount,
      type: 'number',
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          paid_amount: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Remaining Amount',
      value: formData.remaining_amount,
      type: 'number',
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
      title: 'Date',
      class: 'pb-3 text-start min-w-[20%]',
    },
    {
      title: 'Description',
      class: 'pb-3 text-start min-w-[20%]',
    },
    {
      title: 'Amount',
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
      class: 'pb-3 text-start min-w-[15%]',
    },
    {
      title: 'details',
      class: 'pb-3 pr-12 text-end min-w-[15%]',
    },
  ]
  const modalData =
    selectedSale && selectedSale.currentSale
      ? [
          {
            label: 'Date',
            value: `${new Date(
              selectedSale.currentSale.date,
            ).toLocaleDateString()}`,
          },
          {
            label: 'Amount',
            value: `${selectedSale.currentSale.amount} DA`,
          },
          { label: 'Description', value: selectedSale.currentSale.description },
          {
            label: 'Paid Amount',
            value: selectedSale.currentSale.paid_amount,
          },

          {
            label: 'Remaining Amount',
            value: selectedSale.remaining_amount,
          },
        ]
      : []
  console.log(formData)
  return (
    <main className="container mx-auto p-4 mt-[52px] flex flex-wrap mb-5">
      <div className="w-full max-w-full px-3 mb-6 mx-auto">
        <div className="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white m-5">
          <div className="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30">
            <div className="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
              <h3 className="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark">
                <span className="mr-3 font-semibold text-dark">
                  Tous Les sales
                </span>
              </h3>
              <div className="relative flex items-center my-2 border rounded-lg h-[40px] ml-auto min-w-[50%]">
                <input
                  type="text"
                  placeholder="Search sales..."
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
                  onClick={() => setShowConfirmModal(true)} // Show the confirmation modal
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Delete All
                </button>
              </div>
            </div>
            <Table
              data={filteredSales}
              actions={actions}
              headerConfig={headerConfig}
              tableTitle={'sales'}
            />
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <ConfirmModal
          title="Delete Sale"
          message={`Are you sure you want to delete this sale?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete all sales?"
          onConfirm={handleDeleteAll}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      {showUpdateModal && selectedSale && (
        <UpdateModal
          title="Sale"
          InputsConfig={InputsConfig}
          onSubmit={handleSubmit}
          onCancel={handleCancelUpdate}
        />
      )}
      {showDetailsModal && selectedSale && (
        <DetailsModal
          isOpen={showDetailsModal}
          onClose={handleCloseDetails}
          title={
            selectedSale
              ? `Sale : ${selectedSale.currentSale.id.toString().toUpperCase()}`
              : ''
          }
          data={modalData}
          formatDate={(dateString) => new Date(dateString).toLocaleDateString()}
          tableData={products}
        />
      )}
    </main>
  )
}

export default OSalesContent
