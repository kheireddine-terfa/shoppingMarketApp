import React, { useState } from 'react'

const AddProductModal = ({ onSubmit, onCancel }) => {
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productQuantity, setProductQuantity] = useState('')
  const [minQuantity, setMinQuantity] = useState('')
  const [barCode, setBarCode] = useState('')
  const [productImage, setProductImage] = useState(null)

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newProduct = {
      name: productName,
      bare_code: barCode,
      price: parseFloat(productPrice),
      quantity: parseInt(productQuantity),
      min_quantity: parseInt(minQuantity),
      image: productImage, // Include the image in the product data
    }
    onSubmit(newProduct)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Product Bare Code</label>
            <input
              type="text"
              value={barCode}
              onChange={(e) => setBarCode(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Quantity</label>
            <input
              type="number"
              value={productQuantity}
              onChange={(e) => setProductQuantity(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Minimum Quantity</label>
            <input
              type="number"
              value={minQuantity}
              onChange={(e) => setMinQuantity(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Product Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept="image/*"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductModal
