import React, { useEffect, useState } from 'react'
import Table from '../commonComponents/Table'
// import AddProductModal from './relatedComponents/AddProductModal'
import AddModal from '../commonComponents/AddModal'
import ConfirmModal from '../commonComponents/ConfirmModal'
import ProductUpdateModal from './relatedComponents/ProductUpdateModal'
import DetailsModal from '../commonComponents/DetailsModal'
import './style.css'

const ProductsContent = () => {
  //----------- States:
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const initialFormData = {
    productName: '',
    productPrice: '',
    productPurchasePrice: '',
    productQuantity: '',
    minQuantity: '',
    barCode: '',
    productImage: null,
    isBalanced: false,
    hasBarCode: false,
    selectedCategory: '',
    expirationDate: '',
    alertInterval: '',
  }
  const [formData, setFormData] = useState(initialFormData)
  // Fetch products from the backend

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products')
      const data = await response.json()
      setProducts(
        data.map((product) => {
          let inventoryState = ''
          let inventoryStateClass = ''

          if (product.quantity > product.min_quantity) {
            inventoryState = 'In Stock'
            inventoryStateClass = 'text-green-900 bg-green-200'
          } else if (
            product.quantity > 0 &&
            product.quantity <= product.min_quantity
          ) {
            inventoryState = 'Low Stock'
            inventoryStateClass = 'text-orange-900 bg-orange-200'
          } else if (product.quantity === 0) {
            inventoryState = 'Out of Stock'
            inventoryStateClass = 'text-red-900 bg-red-200'
          }
          return {
            id: product.id,
            imageSrc:
              product.image !== null
                ? `/productsImages/${product.image}`
                : '/productsImages/default_image.png',
            imageAlt: product.name,
            titleHref: `/product/${product.id}`,
            title: product.name,
            price: `${product.price} DA`,
            sales: 'N/A',
            inventoryState,
            inventoryStateClass,
            currentProduct: product,
            alert_interval: product.ExpirationDates[0].alert_interval,
          }
        }),
      )
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])
  const handleDeleteClick = (product) => {
    setSelectedProduct(product) // Ensure the correct product object is set
    setShowDeleteModal(true)
  }

  // Handle delete
  const handleConfirmDelete = async () => {
    if (!selectedProduct) return // Ensure selectedProduct is set
    try {
      const response = await fetch(
        `http://localhost:3001/api/products/${selectedProduct}`,
        {
          // Use template literal with backticks
          method: 'DELETE',
        },
      )
      if (response.ok) {
        // Remove the deleted product from the state
        setProducts(products.filter((p) => p.id !== selectedProduct))
        setSelectedProduct(null) // Reset selectedProduct after deletion
        setShowDeleteModal(false) // Close the delete modal
      } else {
        console.error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  // Handle delete all products
  const handleDeleteAll = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products', {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchProducts() // Re-fetch products after all are deleted
        setShowConfirmModal(false) // Close the modal
      } else {
        console.error('Failed to delete all products')
      }
    } catch (error) {
      console.error('Error deleting all products:', error)
    }
  }
  // Handle add product
  const handleAddProduct = async (newProduct) => {
    try {
      const formData = new FormData()
      formData.append('name', newProduct.name)
      if (newProduct.bare_code) {
        formData.append('bare_code', newProduct.bare_code)
      }
      formData.append('price', newProduct.price)
      formData.append('purchase_price', newProduct.purchase_price)
      formData.append('quantity', newProduct.quantity)
      formData.append('min_quantity', newProduct.min_quantity)
      formData.append('hasBarCode', newProduct.hasBarCode)
      formData.append('balanced_product', newProduct.balanced_product)
      formData.append('expiration_date', newProduct.expiration_date)
      formData.append('alert_interval', newProduct.alert_interval)

      if (!newProduct.hasBarCode) {
        formData.append('category', newProduct.category)
      }
      if (newProduct.image) {
        formData.append('image', newProduct.image) // Append the image file
      }
      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        body: formData, // Send the FormData
      })
      if (response.ok) {
        const addedProduct = await response.json()

        // Update the state with the new product including its image
        const updatedProduct = {
          id: addedProduct.id,
          imageSrc: addedProduct.image
            ? `/productsImages/${addedProduct.image}`
            : '/productsImages/default_image.png',
          imageAlt: addedProduct.name,
          titleHref: `/product/${addedProduct.id}`,
          title: addedProduct.name,
          price: `${addedProduct.price} DA`,
          sales: 'N/A',
          inventoryState:
            addedProduct.quantity > addedProduct.min_quantity
              ? 'In Stock'
              : addedProduct.quantity > 0 &&
                addedProduct.quantity < addedProduct.min_quantity
              ? 'Low Stock'
              : 'Out of Stock',
          inventoryStateClass:
            addedProduct.quantity > addedProduct.min_quantity
              ? 'text-green-900 bg-green-200'
              : addedProduct.quantity > 0
              ? 'text-orange-900 bg-orange-200'
              : 'text-red-900 bg-red-200',
        }
        setProducts((prevProducts) => [...prevProducts, updatedProduct])
        fetchProducts()
        setShowModal(false)
        // Reset form data after adding a product
        setFormData(initialFormData)
      } else {
        console.error('Failed to add the product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }
  const handleUpdateProduct = (product) => {
    setSelectedProduct(product)
    setShowUpdateModal(true)
  }

  const handleUpdateSubmit = (updatedProduct) => {
    fetchProducts()
    setShowUpdateModal(false)
    setSelectedProduct(null)
  }

  const handleCancelUpdate = () => {
    setShowUpdateModal(false)
  }
  const handleShowDetails = (product) => {
    setSelectedProduct(product)
    setShowDetailsModal(true) // Show the details modal
  }

  const handleCloseDetails = () => {
    setShowDetailsModal(false) // Close the details modal
  }
  // Filter products searching :
  const filteredProducts = products.filter((product) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      (product.title && product.title.toLowerCase().includes(searchLower)) ||
      (product.inventoryState &&
        product.inventoryState.toLowerCase().includes(searchLower)) ||
      (product.price.toString() &&
        product.price.toString().toLowerCase().includes(searchLower))
    )
  })
  const actions = {
    onDelete: handleDeleteClick,
    onUpdate: handleUpdateProduct,
    onShowDetails: handleShowDetails,
  }
  const handleAddSubmit = (e) => {
    e.preventDefault()
    const newProduct = {
      name: formData.productName,
      price: formData.productPrice,
      purchase_price: formData.productPurchasePrice,
      bare_code: formData.hasBarCode ? formData.barCode : null,
      quantity: parseInt(formData.productQuantity),
      min_quantity: parseInt(formData.minQuantity),
      image: formData.productImage,
      balanced_product: formData.isBalanced,
      category: formData.hasBarCode ? null : formData.selectedCategory,
      hasBarCode: formData.hasBarCode,
      expiration_date: formData.expirationDate,
      alert_interval: formData.alertInterval,
    }
    handleAddProduct(newProduct)
  }
  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      productImage: e.target.files[0],
    }))
  }
  const InputsConfig = [
    {
      label: 'Product Name',
      value: formData.productName,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          productName: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Balanced Product',
      type: 'checkbox',
      checked: formData.isBalanced,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          isBalanced: e.target.checked,
        })),
    },
    {
      label: 'Has Barcode',
      type: 'checkbox',
      checked: formData.hasBarCode,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          hasBarCode: e.target.checked,
        })),
    },
    {
      label: 'Category',
      type: 'select',
      value: formData.selectedCategory,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          selectedCategory: e.target.value,
        })),
      options: categories,
      disabled: formData.hasBarCode,
    },
    {
      label: 'Product Bare Code',
      value: formData.barCode,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          barCode: e.target.value,
        })),
      disabled: !formData.hasBarCode,
      required: formData.hasBarCode,
    },
    {
      label: 'Price',
      type: 'number',
      min: 1,
      value: formData.productPrice,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          productPrice: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Purchase Price',
      type: 'number',
      min: 1,
      value: formData.productPurchasePrice,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          productPurchasePrice: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Quantity',
      type: 'number',
      min: 1,
      value: formData.productQuantity,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          productQuantity: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Minimum Quantity',
      type: 'number',
      min: 1,
      value: formData.minQuantity,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          minQuantity: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Expiration Date',
      type: 'date',
      value: formData.expirationDate,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          expirationDate: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Alert Interval (days)',
      type: 'number',
      min: 1,
      value: formData.alertInterval,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          alertInterval: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Product Image',
      type: 'file',
      onChange: handleImageChange,
      accept: 'image/*',
      required: true,
    },
  ]
  const headerConfig = [
    {
      title: 'Title',
      class: 'pb-3 text-start min-w-[175px]',
    },
    {
      title: 'Price',
      class: 'pb-3 text-start min-w-[100px]',
    },
    {
      title: 'Sales',
      class: 'pb-3 text-start min-w-[100px]',
    },
    {
      title: 'Inventory State',
      class: 'pb-3 text-start min-w-[175px]',
    },
    {
      title: 'Manage',
      class: 'pb-3 pr-12 text-start min-w-[175px]',
    },
    {
      title: 'Details',
      class: 'pb-3 text-end min-w-[50px]',
    },
  ]
  const getInventoryStateClass = (state) => {
    switch (state) {
      case 'In Stock':
        return 'text-green-900 font-medium'
      case 'Low Stock':
        return 'text-orange-900 font-medium'
      case 'Out of Stock':
        return 'text-red-900 font-medium'
      default:
        return 'text-gray-900 font-medium'
    }
  }
  // Find the category name based on the categoryId
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : 'No Category'
  }
  const modalData =
    selectedProduct && selectedProduct.currentProduct
      ? [
          {
            label: 'Price',
            value: `${selectedProduct.currentProduct.price} DA`,
          },
          { label: 'Quantity', value: selectedProduct.currentProduct.quantity },
          {
            label: 'Min Quantity',
            value: selectedProduct.currentProduct.min_quantity,
          },
          {
            label: 'Inventory State',
            value: selectedProduct.inventoryState,
            className: getInventoryStateClass(selectedProduct.inventoryState),
          },
          {
            label: 'Category',
            value: getCategoryName(
              selectedProduct.currentProduct.categoryId,
              categories,
            ),
          },
          {
            label: 'Has Barcode',
            value: selectedProduct.currentProduct.hasBarCode ? 'Yes' : 'No',
          },
          {
            label: 'Balanced Product',
            value: selectedProduct.currentProduct.balanced_product
              ? 'Yes'
              : 'No',
          },
          {
            label: 'Alert Interval',
            value: `${selectedProduct.alert_interval} days`,
          },
          {
            label: 'Expiration Dates',
            value: selectedProduct.currentProduct.ExpirationDates,
          },
        ]
      : []

  return (
    <main className="container mx-auto p-4 mt-[52px] flex flex-wrap mb-5">
      <div className="w-full max-w-full px-3 mb-6 mx-auto">
        <div className="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white m-5">
          <div className="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30">
            <div className="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
              <h3 className="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark">
                <span className="mr-3 font-semibold text-dark">
                  Tous Les Produits
                </span>
              </h3>
              <div className="relative flex items-center my-2 border rounded-lg h-[40px] ml-auto min-w-[50%]">
                <input
                  type="text"
                  placeholder="Search products..."
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
                  Add New Product
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
              data={filteredProducts}
              actions={actions}
              headerConfig={headerConfig}
              tableTitle={'products'}
            />
          </div>
        </div>
      </div>
      {showModal && (
        <AddModal
          onSubmit={handleAddSubmit}
          onCancel={() => setShowModal(false)}
          InputsConfig={InputsConfig}
          title={'Product'}
        />
      )}
      {showDeleteModal && (
        <ConfirmModal
          title="Delete Product"
          message={`Are you sure you want to delete this product?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete all products?"
          onConfirm={handleDeleteAll}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      {showUpdateModal && selectedProduct && (
        <ProductUpdateModal
          product={selectedProduct}
          onSubmit={handleUpdateSubmit}
          onCancel={handleCancelUpdate}
        />
      )}

      {showDetailsModal && selectedProduct && (
        <DetailsModal
          isOpen={showDetailsModal}
          onClose={handleCloseDetails}
          title={
            selectedProduct
              ? selectedProduct.currentProduct.name.toUpperCase()
              : ''
          }
          data={modalData}
          formatDate={(dateString) => new Date(dateString).toLocaleDateString()}
        />
      )}
    </main>
  )
}

export default ProductsContent
