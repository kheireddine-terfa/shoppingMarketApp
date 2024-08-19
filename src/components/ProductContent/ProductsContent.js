import React, { useEffect, useState } from 'react'
import ProductTable from './relatedComponents/ProductTable'
import AddProductModal from './relatedComponents/AddProductModal'
import ConfirmModal from './relatedComponents/ConfirmModal'
import './style.css'

const ProductsContent = () => {
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  // Fetch products from the backend
  useEffect(() => {
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
            }
          }),
        )
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id),
        )
      } else {
        console.error('Failed to delete the product')
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
        setProducts([]) // Clear the products list
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
      formData.append('bare_code', newProduct.bare_code)
      formData.append('price', newProduct.price)
      formData.append('quantity', newProduct.quantity)
      formData.append('min_quantity', newProduct.min_quantity)
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
              : addedProduct.quantity > 0
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
        setShowModal(false)
      } else {
        console.error('Failed to add the product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
    }
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
            <ProductTable products={filteredProducts} onDelete={handleDelete} />
          </div>
        </div>
      </div>
      {showModal && (
        <AddProductModal
          onSubmit={handleAddProduct}
          onCancel={() => setShowModal(false)}
        />
      )}
      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete all products?"
          onConfirm={handleDeleteAll}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </main>
  )
}

export default ProductsContent
