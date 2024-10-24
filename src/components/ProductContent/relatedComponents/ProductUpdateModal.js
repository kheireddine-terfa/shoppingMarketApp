import React, { useState, useEffect } from 'react'

const ProductUpdateModal = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    purchase_price: '',
    expiration_date: '',
    alert_interval: '',
    quantity: '',
    min_quantity: '',
    bare_code: '',
    image: null,
    category: '',
  })
  const [categories, setCategories] = useState([])
  useEffect(() => {
    // Fetch all categories when the component mounts
    const fetchCategories = async () => {
      const token = sessionStorage.getItem('token')
      try {
        const response = await fetch('http://localhost:3001/api/categories', {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token
          },
        })
        const data = await response.json()
        setCategories(data) // Assuming data is an array of categories
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
    // Initialize form data with product data
    setFormData({
      name: product.name || '',
      price: product.price || '',
      purchase_price: product.purchase_price || '',
      expiration_date: product.expiration_date || '',
      alert_interval: product.ExpirationDates[0].alert_interval || '',
      quantity: product.quantity || '',
      min_quantity: product.min_quantity || '',
      bare_code: product.bare_code || '',
      image: null, // Assuming image is handled separately
      category: product.categoryId || '',
    })
  }, [product])
  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const updatedProduct = new FormData()
    updatedProduct.append('name', formData.name)
    updatedProduct.append('price', formData.price)
    updatedProduct.append('purchase_price', formData.purchase_price)
    updatedProduct.append('expiration_date', formData.expiration_date)
    updatedProduct.append('alert_interval', formData.alert_interval)
    updatedProduct.append('quantity', formData.quantity)
    updatedProduct.append('min_quantity', formData.min_quantity)
    updatedProduct.append('bare_code', formData.bare_code)
    updatedProduct.append('category', formData.category)

    // Only append image if a new image is selected
    if (formData.image) {
      updatedProduct.append('image', formData.image)
    }
    try {
      const token = sessionStorage.getItem('token')
      const response = await fetch(
        `http://localhost:3001/api/products/${product.id}`,
        {
          method: 'PUT',
          body: updatedProduct,
          headers: {
            Authorization: `Bearer ${token}`, // Send the token
          },
        },
      )
      if (response.ok) {
        const updatedProductData = await response.json()
        onSubmit(updatedProductData)
      } else {
        console.error('Failed to update the product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">Update Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex">
            {/* Left Column */}
            <div className="w-1/2 pr-4">
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Purchase Price</label>
                <input
                  type="number"
                  name="purchase_price"
                  value={formData.purchase_price}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Expiration Date</label>
                <input
                  type="date"
                  name="expiration_date"
                  value={formData.expiration_date}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Alert Interval</label>
                <input
                  type="number"
                  name="alert_interval"
                  value={formData.alert_interval}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-gray-300"></div>

            {/* Right Column */}
            <div className="w-1/2 pl-4">
              <div className="mb-4">
                <label className="block text-gray-700">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Minimum Quantity</label>
                <input
                  type="number"
                  name="min_quantity"
                  value={formData.min_quantity}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Barcode</label>
                <input
                  type="text"
                  name="bare_code"
                  value={formData.bare_code}
                  onChange={handleChange}
                  disabled={formData.bare_code === ''}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                  disabled={formData.category === ''}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductUpdateModal
