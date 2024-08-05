import React, { useState, useEffect } from 'react';

const ProductForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [bareCode, setBareCode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price, bare_code: bareCode, quantity, min_quantity: minQuantity }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await response.json();
      setName('');
      setPrice('');
      setBareCode('');
      setQuantity('');
      setMinQuantity('');
      setSuccessMessage(`Product "${name}" added successfully!`);

      const updatedProductsResponse = await fetch('http://localhost:3001/api/products');
      const updatedProducts = await updatedProductsResponse.json();
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="mb-4 p-5 bg-blue-400 rounded-xl w-1/2">
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
        <div className="mb-4">
          <label htmlFor="bareCode" className="block text-gray-700">
            Bare Code:
          </label>
          <input
            type="text"
            id="bareCode"
            value={bareCode}
            onChange={(e) => setBareCode(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-gray-700">
            Quantity:
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="minQuantity" className="block text-gray-700">
            Minimum Quantity:
          </label>
          <input
            type="number"
            id="minQuantity"
            value={minQuantity}
            onChange={(e) => setMinQuantity(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600">
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
            {product.name} - ${product.price} - {product.bare_code} - Qty: {product.quantity} - Min Qty: {product.min_quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductForm;
