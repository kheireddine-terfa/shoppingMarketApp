import {
  getInventoryState,
  checkForAlert,
  initialFormData,
} from '../utilities/productUtils'
export const fetchProducts = async (setProducts) => {
  try {
    const response = await fetch('http://localhost:3001/api/products')
    const data = await response.json()
    setProducts(
      data.map((product) => {
        const { inventoryState, inventoryStateClass } = getInventoryState(
          product.quantity,
          product.min_quantity,
        )
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
          inventoryState,
          inventoryStateClass,
          currentProduct: product,
          alert_interval: product.ExpirationDates[0].alert_interval,
          expAlert: checkForAlert(product.ExpirationDates),
        }
      }),
    )
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}
export const fetchCategories = async (setCategories) => {
  try {
    const response = await fetch('http://localhost:3001/api/categories')
    const data = await response.json()
    setCategories(data)
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}
// Handle add product
export const handleAddProduct = async (
  newProduct,
  setProducts,
  setShowModal,
  setFormData,
) => {
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
      fetchProducts(setProducts)
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
// handel delete all products
export const handleDeleteAll = async (setProducts, setShowConfirmModal) => {
  try {
    const response = await fetch('http://localhost:3001/api/products', {
      method: 'DELETE',
    })

    if (response.ok) {
      fetchProducts(setProducts) // Re-fetch products after all are deleted
      setShowConfirmModal(false) // Close the modal
    } else {
      console.error('Failed to delete all products')
    }
  } catch (error) {
    console.error('Error deleting all products:', error)
  }
}
// handle delete product :

export const handleConfirmDelete = async (
  selectedProduct,
  setProducts,
  products,
  setSelectedProduct,
  setShowDeleteModal,
) => {
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
//
export const handleAddSubmit = (
  e,
  formData,
  setProducts,
  setShowModal,
  setFormData,
) => {
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
  handleAddProduct(newProduct, setProducts, setShowModal, setFormData)
}
