import React, { useEffect, useState } from 'react'
import Table from '../commonComponents/Table'
// import AddProductModal from './relatedComponents/AddProductModal'
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
  const initialFormData = {
    name: '',
    image: null,
  }
  const [formData, setFormData] = useState(initialFormData)
  // Fetch categories from the backend

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/categories')
      const data = await response.json()
      setCategories(
        data.map((category) => {
          return {
            id: category.id,
            imageSrc:
              category.image !== null
                ? `/categoriesImages/${category.image}`
                : '/categoriesImages/default_image.png',
            imageAlt: category.name,
            titleHref: `/categories/${category.id}`,
            title: category.name,
            currentCategory: category,
          }
        }),
      )
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }
  useEffect(() => {
    fetchCategories()
  }, [])
  const handleDeleteClick = (category) => {
    setSelectedCategory(category) // Ensure the correct category object is set
    setShowDeleteModal(true)
  }

  // Handle delete
  const handleConfirmDelete = async () => {
    if (!selectedCategory) return // Ensure selectedCategory is set
    try {
      const response = await fetch(
        `http://localhost:3001/api/categories/${selectedCategory}`,
        {
          // Use template literal with backticks
          method: 'DELETE',
        },
      )
      if (response.ok) {
        // Remove the deleted category from the state
        setCategories(categories.filter((p) => p.id !== selectedCategory))
        setSelectedCategory(null) // Reset selectedCategory after deletion
        setShowDeleteModal(false) // Close the delete modal
      } else {
        console.error('Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  // Handle delete all categories
  const handleDeleteAll = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/categories', {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchCategories() // Re-fetch categorys after all are deleted
        setShowConfirmModal(false) // Close the modal
      } else {
        console.error('Failed to delete all categories')
      }
    } catch (error) {
      console.error('Error deleting all categories:', error)
    }
  }
  // Handle add category
  const handleAddCategory = async (newCategory) => {
    try {
      const formData = new FormData()
      formData.append('name', newCategory.name)
      if (newCategory.image) {
        formData.append('image', newCategory.image) // Append the image file
      }
      const response = await fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        body: formData, // Send the FormData
      })
      if (response.ok) {
        const addedCategory = await response.json()

        // Update the state with the new category including its image
        const updatedCategory = {
          id: addedCategory.id,
          imageSrc: addedCategory.image
            ? `/categoriesImages/${addedCategory.image}`
            : '/categoriesImages/default_image.png',
          imageAlt: addedCategory.name,
          titleHref: `/categories/${addedCategory.id}`,
          title: addedCategory.name,
        }
        setCategories((prevCategories) => [...prevCategories, updatedCategory])
        fetchCategories()
        setShowModal(false)
        // Reset form data after adding a category
        setFormData(initialFormData)
      } else {
        console.error('Failed to add the category')
      }
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }
  const handleUpdate = async (updatedCategory) => {
    try {
      // Create a FormData object to handle the file upload and other data
      const formData = new FormData()
      formData.append('name', updatedCategory.name) // Append the category name
      if (updatedCategory.image) {
        formData.append('image', updatedCategory.image) // Append the category image if it exists
      }

      // Send the updated data to the backend
      const response = await fetch(
        `http://localhost:3001/api/categories/${updatedCategory.id}`,
        {
          method: 'PUT',
          body: formData,
        },
      )

      if (!response.ok) {
        throw new Error('Failed to update the category')
      } else {
        fetchCategories()
        setShowUpdateModal(false)
        setFormData(initialFormData)
        setIsUpdate(false) // Set update flag to false
      }

      const result = await response.json()
      console.log('Category updated successfully:', result)

      // Add any further logic if needed, such as updating the UI or notifying the user
    } catch (error) {
      console.error('Error updating category:', error)
      // Handle the error, e.g., show an error message to the user
    }
  }
  const handleSubmit = (event) => {
    event.preventDefault()

    const updatedCategory = {
      id: selectedCategory.id, // The ID of the category being updated
      name: formData.name,
      image: formData.image,
    }

    handleUpdate(updatedCategory)
  }
  const handleUpdateCategory = (category) => {
    setSelectedCategory(category)
    console.log('category :', category)
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

  // Filter categories searching :
  const filteredCategories = categories.filter((category) => {
    const searchLower = searchQuery.toLowerCase()
    return category.title && category.title.toLowerCase().includes(searchLower)
  })
  const actions = {
    onDelete: handleDeleteClick,
    onUpdate: handleUpdateCategory,
  }
  const handleAddSubmit = (e) => {
    e.preventDefault()
    const newCategory = {
      name: formData.name,
      image: formData.image,
    }
    handleAddCategory(newCategory)
  }
  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }))
  }
  const InputsConfig = [
    {
      label: 'Category Name',
      value: formData.name,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          name: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Category Image',
      type: 'file',
      onChange: handleImageChange,
      accept: 'image/*',
      required: !isUpdate, // Only required if it's not an update,
    },
  ]
  const headerConfig = [
    {
      title: 'Title',
      class: 'pb-3 text-start min-w-[50%]',
    },
    {
      title: 'Manage',
      class: 'pb-3 pr-12 text-end min-w-[50%]',
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
              data={filteredCategories}
              actions={actions}
              headerConfig={headerConfig}
              tableTitle={'categories'}
            />
          </div>
        </div>
      </div>
      {showModal && (
        <AddModal
          onSubmit={handleAddSubmit}
          onCancel={() => setShowModal(false)}
          InputsConfig={InputsConfig}
          title={'Category'}
        />
      )}
      {showDeleteModal && (
        <ConfirmModal
          title="Delete Category"
          message={`Are you sure you want to delete this Category?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete all categories?"
          onConfirm={handleDeleteAll}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      {showUpdateModal && selectedCategory && (
        // <UpdateModal
        //   onSubmit={handleUpdateSubmit}
        //   onCancel={handleCancelUpdate}
        // />
        <UpdateModal
          title="Category"
          InputsConfig={InputsConfig}
          onSubmit={handleSubmit}
          onCancel={handleCancelUpdate}
        />
      )}
    </main>
  )
}

export default CategoriesContent
