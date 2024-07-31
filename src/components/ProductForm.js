import React, { useState, useEffect } from 'react'

const ProductForm = () => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [products, setProducts] = useState([])
  const [successMessage, setSuccessMessage] = useState('') // New state for success message

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products')
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, []) // Empty dependency array ensures this runs once on component mount

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      await response.json()
      setName('')
      setPrice('')
      setSuccessMessage(`Product "${name}" added successfully!`) // Set success message
      // Fetch updated product list
      const updatedProductsResponse = await fetch(
        'http://localhost:3001/api/products',
      )
      const updatedProducts = await updatedProductsResponse.json()
      setProducts(updatedProducts)
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  return (
    <div className="p-4">
      <form
        onSubmit={handleSubmit}
        className="mb-4 p-5 bg-blue-400 rounded-xl w-1/2"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Product Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700">
            Price:
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
        >
          Save Product
        </button>
      </form>
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded-md">
          {successMessage}
        </div>
      )}
      <h2 className="text-xl font-bold">Product List</h2>
      <ul className="list-disc pl-5">
        {products.map((product) => (
          <li key={product.id} className="mb-2">
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProductForm
