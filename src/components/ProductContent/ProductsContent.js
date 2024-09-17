import React, { useEffect, useState } from 'react'
import Table from '../commonComponents/Table'
import {
  filteredProducts,
  modalData,
  initialFormData,
} from '../../utilities/productUtils'
import { InputsConfig, headerConfig } from '../../config/productConfig'
import {
  fetchProducts,
  fetchCategories,
  handleDeleteAll,
  handleConfirmDelete,
  handleAddSubmit,
} from '../../api/productApi'
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
  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => {
    fetchProducts(setProducts)
    fetchCategories(setCategories)
    // eslint-disable-next-line
  }, [])
  const handleDeleteClick = (product) => {
    setSelectedProduct(product) // Ensure the correct product object is set
    setShowDeleteModal(true)
  }

  const handleUpdateProduct = (product) => {
    setSelectedProduct(product)
    setShowUpdateModal(true)
  }

  const handleUpdateSubmit = (updatedProduct) => {
    fetchProducts(setProducts)
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
  const actions = {
    onDelete: handleDeleteClick,
    onUpdate: handleUpdateProduct,
    onShowDetails: handleShowDetails,
  }

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
              data={filteredProducts(products, searchQuery)}
              actions={actions}
              headerConfig={headerConfig}
              tableTitle={'products'}
            />
          </div>
        </div>
      </div>
      {showModal && (
        <AddModal
          onSubmit={(e) =>
            handleAddSubmit(e, formData, setProducts, setShowModal, setFormData)
          }
          onCancel={() => setShowModal(false)}
          InputsConfig={InputsConfig(formData, setFormData, categories)}
          title={'Product'}
        />
      )}
      {showDeleteModal && (
        <ConfirmModal
          title="Delete Product"
          message={`Are you sure you want to delete this product?`}
          onConfirm={() =>
            handleConfirmDelete(
              selectedProduct,
              setProducts,
              products,
              setSelectedProduct,
              setShowDeleteModal,
            )
          }
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete all products?"
          onConfirm={() => handleDeleteAll(setProducts, setShowConfirmModal)}
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
          data={modalData(selectedProduct, categories)}
          formatDate={(dateString) => new Date(dateString).toLocaleDateString()}
        />
      )}
    </main>
  )
}

export default ProductsContent
