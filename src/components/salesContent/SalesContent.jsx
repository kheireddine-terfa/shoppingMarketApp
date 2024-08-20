/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import SaledProduct from './SaledProduct'
import Category from './Category'
import QuantityModal from './QuantityModal'
import BarcodeScanner from '../barcodeScanner/BarcodeScanner'

const SalesContent = () => {
  const [categories, setCategories] = useState([])
  const [noBarCodeProducts, setNoBarCodeProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [productsToSale, setProductsToSale] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [sale, setSale] = useState(null)
  const [productsSale, setProductsSale] = useState(null)
  const [isPaid, setIsPaid] = useState(true) // New state for payment status
  const [paidAmount, setPaidAmount] = useState(0) // New state for paid amount
  const [remainingAmount, setRemainingAmount] = useState(0) // New state for remaining amount
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [description, setDescription] = useState('')

  // Fetch categories and products when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/categories') // Replace with your API
        setCategories(response.data)
      } catch (error) {
        console.error('Failed to fetch categories', error)
      }
    }

    const fetchNoBarCodeProducts = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/api/products/no-barcode',
        ) // Replace with your API endpoint
        setNoBarCodeProducts(response.data)
        console.log(noBarCodeProducts)
      } catch (error) {
        console.error('Failed to fetch products', error)
      }
    }

    fetchCategories()
    fetchNoBarCodeProducts()
  }, [])

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    const filteredProducts = noBarCodeProducts.filter(
      (product) => product.categoryId === category.id,
    )
    console.log(filteredProducts)
    setSelectedProducts(filteredProducts)
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setSelectedProduct(null)
  }

  const handleAddToSale = (product, selectedQuantity) => {
    if (selectedQuantity === 0) {
      return
    }

    const existingProduct = productsToSale.find((p) => p.id === product.id)
    if (existingProduct) {
      setProductsToSale(
        productsToSale.map((p) => (p.id === product.id ? { ...p } : p)),
      )
    } else {
      setProductsToSale([
        ...productsToSale,
        { ...product, quantity: selectedQuantity },
      ])
    }

    handleModalClose()
  }

  const handleQuantityUpdate = async (id, newQuantity) => {
    const product = await axios.get(`http://localhost:3001/api/products/${id}`)
    const maxQuantity = product.data.quantity

    console.log(product)

    if (newQuantity > maxQuantity) {
      alert(
        `Quantity cannot exceed the maximum allowed quantity of ${maxQuantity}.`,
      )
      return // Exit the function without updating the state
    }

    // Update the product quantity if the new quantity is valid
    setProductsToSale(
      productsToSale.map((product) =>
        product.id === id ? { ...product, quantity: newQuantity } : product,
      ),
    )
  }

  const handleDelete = (id) => {
    setProductsToSale(productsToSale.filter((product) => product.id !== id))
  }

  const handleValidateSaleClick = async () => {
    const confirmSale = window.confirm(
      'Are you sure you want to confirm this sale?',
    )

    if (!confirmSale) {
      return // Exit the function if the user cancels
    }

    try {
      const totalPrice = productsToSale
        .reduce((sum, product) => {
          const productPrice = product.balanced_product
            ? product.price * (product.quantity / 1000)
            : product.price * product.quantity
          return sum + productPrice
        }, 0)
        .toFixed(2)

      if (isPaid) {
        setRemainingAmount(0)
        setPaidAmount(parseFloat(totalPrice)) // Ensure paidAmount matches totalPrice if paid
      } else {
        setRemainingAmount((totalPrice - paidAmount).toFixed(2))
      }

      // Create the sale
      const saleData = {
        date: new Date(),
        amount: parseFloat(totalPrice),
        paid_amount: paidAmount,
        remaining_amount: parseFloat(remainingAmount),
        description: description,
      }

      const saleResponse = await axios.post(
        'http://localhost:3001/api/sales',
        saleData,
      )
      const createdSale = saleResponse.data
      setSale(createdSale)

      // Create the ProductSale entries
      const productSalePromises = productsToSale.map((product) => {
        return axios.post('http://localhost:3001/api/product-sales', {
          quantity: product.quantity,
          productId: product.id,
          saleId: createdSale.id,
        })
      })

      const productsSaleResponse = await Promise.all(productSalePromises)
      setProductsSale(productsSaleResponse.map((response) => response.data))

      console.log('Sale and ProductSales successfully created', {
        sale: createdSale,
        productsSale: productsSaleResponse,
      })

      // Reload the app after the sale is confirmed and processed
      window.location.reload()
    } catch (error) {
      console.error('Failed to validate sale', error)
    }
  }

  const handleBarcodeScanned = async (barcode) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/products/barcode/${barcode}`,
      )
      const product = response.data

      if (product) {
        handleAddToSale(product, 1) // Add the product with a default quantity of 1
      } else {
        alert('Product not found')
      }
    } catch (error) {
      console.error('Failed to fetch product by barcode', error)
    }
  }

  const totalQuantity = useMemo(() => {
    return productsToSale.reduce(
      (sum, product) => sum + (product.balanced_product ? 1 : product.quantity),
      0,
    )
  }, [productsToSale])

  const totalPrice = useMemo(() => {
    return productsToSale
      .reduce((sum, product) => {
        const productPrice = product.balanced_product
          ? product.price * (product.quantity / 1000)
          : product.price * product.quantity
        return sum + productPrice
      }, 0)
      .toFixed(2)
  }, [productsToSale])

  return (
    <main className="container mx-auto p-4 mt-[52px]">
      <h1 className="text-2xl p-4 w-6/12">Articles sans code barre</h1>
      <div className="flex">
        <section className="w-1/2 p-4 mr-10">
          {selectedCategory === null ? (
            <div className="grid grid-cols-3 gap-5 gap-y-12">
              {categories.map((category) => (
                <Category
                  key={category.id}
                  title={category.name}
                  onClick={() => handleCategoryClick(category)}
                />
              ))}
            </div>
          ) : (
            <>
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-4 py-2 mb-4 bg-[#00ADA3] text-white font-bold rounded-md hover:bg-blue-600"
              >
                Retour aux catégories
              </button>
              <div className="grid grid-cols-3 gap-5 gap-y-12">
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-zinc-100 text-center h-40"
                    onClick={() => handleProductClick(product)}
                  >
                    <img
                      alt={product.name}
                      className="mx-auto h-full object-cover "
                    />
                    <h3 className="mt-2 text-lg md:text-xl lg:text-2xl">
                      {product.name}
                    </h3>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <aside className="w-1/2 mr-10 min-h-[30rem] -mt-10">
          <h1 className="text-2xl mb-4">Liste des produits sélectionnés</h1>

          {productsToSale.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white shadow-md rounded-md p-8">
              <ExclamationCircleIcon className="w-12 h-12 text-gray-500 mb-4" />
              <p className="text-lg font-semibold text-gray-500">
                Il n'y a aucun produit sélectionné
              </p>
            </div>
          ) : (
            <ul className="max-h-[25rem] min-h-[25rem] bg-white overflow-y-auto flex flex-col">
              {productsToSale.map((product) => (
                <li key={product.id} className="p-4">
                  <SaledProduct
                    product={product}
                    onDelete={handleDelete}
                    onQuantityChange={handleQuantityUpdate}
                  />
                </li>
              ))}
            </ul>
          )}

          <div className="flex justify-between p-4 bg-white shadow-md rounded-md mt-4">
            <span className="w-1/3 text-left font-bold text-2xl">Total</span>
            <span className="w-1/3 text-center text-2xl">{totalQuantity}</span>
            <span className="w-1/3 text-right text-2xl">{totalPrice} DA</span>
          </div>

          <div className="flex flex-col mt-4 p-4 bg-white shadow-md rounded-md">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-lg font-semibold">Paid</span>
            </label>
            {!isPaid && (
              <div className="mt-2">
                <label className="block text-lg font-semibold">
                  Amount Paid:
                </label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(parseFloat(e.target.value))}
                  className="mt-1 p-2 w-full border rounded-md"
                  min="0"
                />
              </div>
            )}
            <div className="mt-2">
              <label className="block text-lg font-semibold">Déscription</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
                min="0"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-4 p-4">
            <button
              onClick={handleValidateSaleClick}
              className="px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
              disabled={productsToSale.length === 0}
            >
              Valider
            </button>
            <button
              onClick={() => setProductsToSale([])}
              className="px-4 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600"
            >
              Annuler
            </button>
          </div>
        </aside>
      </div>

      {modalVisible && selectedProduct && (
        <QuantityModal
          product={selectedProduct}
          onClose={handleModalClose}
          onAddToSale={handleAddToSale}
          maxQuantity={selectedProduct.quantity}
        />
      )}
      <BarcodeScanner onBarcodeScanned={handleBarcodeScanned} />
    </main>
  )
}

export default SalesContent
