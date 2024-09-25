import { initialFormData } from '../utilities/categoryUtils'
export const fetchCategories = async (
  setCategories,
  setErrorMessage,
  setShowErrorPopup,
) => {
  try {
    const response = await fetch('http://localhost:3001/api/categories')
    if (!response.ok) {
      setErrorMessage('Failed to fetch categories , please try again later.')
      setShowErrorPopup(true)
      return
    }
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

// Handle add category
export const handleAddCategory = async (
  newCategory,
  setCategories,
  setShowModal,
  setFormData,
  setErrorMessage,
  setShowErrorPopup,
) => {
  try {
    const formData = new FormData()
    formData.append('name', newCategory.name)
    if (newCategory.image) {
      formData.append('image', newCategory.image) // Append the image file
      console.log('seeet')
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
      fetchCategories(setCategories)
      setShowModal(false)
      // Reset form data after adding a category
      setFormData(initialFormData)
    } else {
      const errorData = await response.json() // Parse the error message
      setErrorMessage(errorData.message || 'Failed to add the catgory')
      setShowErrorPopup(true)
      return
    }
  } catch (error) {
    console.error('Error adding category:', error)
  }
}

export const handleAddSubmit = (
  e,
  formData,
  setCategories,
  setShowModal,
  setFormData,
  setErrorMessage,
  setShowErrorPopup,
) => {
  e.preventDefault()
  const newCategory = {
    name: formData.name,
    image: formData.image,
  }
  handleAddCategory(
    newCategory,
    setCategories,
    setShowModal,
    setFormData,
    setErrorMessage,
    setShowErrorPopup,
  )
}

export const handleUpdate = async (
  updatedCategory,
  setCategories,
  setShowUpdateModal,
  setFormData,
  setIsUpdate,
  setErrorMessage,
  setShowErrorPopup,
) => {
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
      const errorData = await response.json() // Parse the error message
      setErrorMessage(errorData.message || 'Failed to update the category')
      setShowErrorPopup(true)
      return
    } else {
      fetchCategories(setCategories)
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
export const handleSubmit = (
  e,
  formData,
  setCategories,
  setShowUpdateModal,
  setFormData,
  selectedCategory,
  setIsUpdate,
  setErrorMessage,
  setShowErrorPopup,
) => {
  e.preventDefault()

  const updatedCategory = {
    id: selectedCategory.id, // The ID of the category being updated
    name: formData.name,
    image: formData.image,
  }

  handleUpdate(
    updatedCategory,
    setCategories,
    setShowUpdateModal,
    setFormData,
    setIsUpdate,
    setErrorMessage,
    setShowErrorPopup,
  )
}
// handel delete all suppliers
export const handleDeleteAll = async (
  setCategories,
  setShowConfirmModal,
  setErrorMessage,
  setShowErrorPopup,
) => {
  try {
    const response = await fetch('http://localhost:3001/api/categories', {
      method: 'DELETE',
    })

    if (response.ok) {
      fetchCategories(setCategories) // Re-fetch categorys after all are deleted
      setShowConfirmModal(false) // Close the modal
    } else {
      const errorData = await response.json() // Parse the error message
      setErrorMessage(errorData.message || 'Failed to delete all categories')
      setShowErrorPopup(true)
      return
    }
  } catch (error) {
    console.error('Error deleting all categories:', error)
  }
}
// handle delete supplier :

export const handleConfirmDelete = async (
  selectedCategory,
  setCategories,
  categories,
  setSelectedCategory,
  setShowDeleteModal,
  setErrorMessage,
  setShowErrorPopup,
) => {
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
      setCategories(categories.filter((c) => c.id !== selectedCategory))
      setSelectedCategory(null) // Reset selectedCategory after deletion
      setShowDeleteModal(false) // Close the delete modal
    } else {
      const errorData = await response.json() // Parse the error message
      setErrorMessage(errorData.message || 'Failed to delete the category')
      setShowErrorPopup(true)
      return
    }
  } catch (error) {
    console.error('Error deleting category:', error)
  }
}
