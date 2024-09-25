import React, { useEffect, useState } from 'react'
import Table from '../commonComponents/Table'
import ErrorPopup from '../commonComponents/ErrorPopup'

import { headerConfig, InputsConfig } from '../../config/categoryConfig'
import {
  initialFormData,
  filteredCategories,
} from '../../utilities/categoryUtils'
import {
  fetchCategories,
  handleAddSubmit,
  handleSubmit,
  handleDeleteAll,
  handleConfirmDelete,
} from '../../api/categoryApi'
import AddModal from '../commonComponents/AddModal'
import ConfirmModal from '../commonComponents/ConfirmModal'
import UpdateModal from '../commonComponents/UpdateModal'
import './style.css'
// check the controller :
const CategoriesContent = () => {
  //----------- States:
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false) // Flag to determine if the form is for update or add
  const [errorMessage, setErrorMessage] = useState('')
  const [showErrorPopup, setShowErrorPopup] = useState(false)

  const [formData, setFormData] = useState(initialFormData)
  // Fetch categories from the backend

  useEffect(() => {
    fetchCategories(setCategories, setErrorMessage, setShowErrorPopup)
  }, [])
  const handleDeleteClick = (category) => {
    setSelectedCategory(category) // Ensure the correct category object is set
    setShowDeleteModal(true)
  }
  const handleUpdateCategory = (category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      image: null,
    })
    setIsUpdate(true) // Set update flag to true
    setShowUpdateModal(true)
  }

  const handleCancelUpdate = () => {
    setShowUpdateModal(false)
    setSelectedCategory(null)
    setIsUpdate(false) // Reset the update flag
  }

  const actions = {
    onDelete: handleDeleteClick,
    onUpdate: handleUpdateCategory,
  }

  return (
    <main className="container mx-auto p-4 mt-[52px] flex flex-wrap mb-5">
      <div className="w-full max-w-full px-3 mb-6 mx-auto">
        <div className="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white m-5">
          <div className="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30">
            <div className="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
              <h3 className="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark">
                <span className="mr-3 font-semibold text-dark">
                  Tous Les Categories
                </span>
              </h3>
              <div className="relative flex items-center my-2 border rounded-lg h-[40px] ml-auto min-w-[50%]">
                <input
                  type="text"
                  placeholder="Search categories..."
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
                  Add New Category
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
              data={filteredCategories(categories, searchQuery)}
              actions={actions}
              headerConfig={headerConfig}
              tableTitle={'categories'}
            />
          </div>
        </div>
      </div>
      {showModal && (
        <AddModal
          onSubmit={(e) =>
            handleAddSubmit(
              e,
              formData,
              setCategories,
              setShowModal,
              setFormData,
              setErrorMessage,
              setShowErrorPopup,
            )
          }
          onCancel={() => setShowModal(false)}
          InputsConfig={InputsConfig(formData, setFormData, isUpdate)}
          title={'Category'}
        />
      )}
      {showDeleteModal && (
        <ConfirmModal
          title="Delete Category"
          message={`Are you sure you want to delete this Category?`}
          onConfirm={() =>
            handleConfirmDelete(
              selectedCategory,
              setCategories,
              categories,
              setSelectedCategory,
              setShowDeleteModal,
              setErrorMessage,
              setShowErrorPopup,
            )
          }
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete all categories?"
          onConfirm={() =>
            handleDeleteAll(
              setCategories,
              setShowConfirmModal,
              setErrorMessage,
              setShowErrorPopup,
            )
          }
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      {showUpdateModal && selectedCategory && (
        <UpdateModal
          title="Category"
          InputsConfig={InputsConfig(formData, setFormData, isUpdate)}
          onSubmit={(e) =>
            handleSubmit(
              e,
              formData,
              setCategories,
              setShowUpdateModal,
              setFormData,
              selectedCategory,
              setIsUpdate,
              setErrorMessage,
              setShowErrorPopup,
            )
          }
          onCancel={handleCancelUpdate}
        />
      )}
      {showErrorPopup && (
        <ErrorPopup
          message={errorMessage}
          onClose={() => setShowErrorPopup(false)}
        />
      )}
    </main>
  )
}

export default CategoriesContent
