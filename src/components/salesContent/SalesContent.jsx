/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import SaledProduct from './SaledProduct'
import Category from './Category'
import QuantityModal from './QuantityModal'
import BarcodeScanner from '../barcodeScanner/BarcodeScanner'
import dayjs from 'dayjs';
import { fetchCategories,fetchNoBarCodeProducts,handleQuantityUpdate, handleValidateSaleClick,handleBarcodeScanned } from '../../api/newSaleApi'
import { handleCategoryClick,handleProductClick, handleModalClose,handleDelete,handleAddToSale } from '../../utilities/newSaleUtils'


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
  const [errorMessage, setErrorMessage] = useState('')
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [moneyGiven, setMoneyGiven] = useState(''); // New state for money given by the customer



  // Fetch categories and products when the component mounts
  useEffect(() => {
    fetchCategories(setCategories,setErrorMessage,setShowErrorPopup)
    fetchNoBarCodeProducts(setNoBarCodeProducts,noBarCodeProducts,setErrorMessage,setShowErrorPopup)
  }, [])

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
    <main className="container mx-auto p-4 mt-[46px]">
     <div>
      <input
       type="text"
       placeholder='enter barcode ... '
       className="mt-4 mr-2 p-2 w-1/3 border rounded-md"
      />
      <button
      className="px-8 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
      >
      search
      </button>

    </div>
      <h1 className="text-2xl p-4 w-6/12">Articles sans code barre</h1>
      <div className="flex">
        <section className="w-1/2 p-4 mr-10">
          {selectedCategory === null ? (
            <div className="grid grid-cols-3 gap-5 gap-y-12">
              {categories.map((category) => (
                <Category
                  imageSrc={`/categoriesImages/${category.image}`}
                  key={category.id}
                  title={category.name}
                  onClick={() => handleCategoryClick(category,setSelectedCategory,setSelectedProducts,noBarCodeProducts)}
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
              <div className=" h-[500px] overflow-y-auto grid grid-cols-4 gap-6 gap-y-12">
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-zinc-100 text-center h-40"
                    onClick={() => handleProductClick(product,setSelectedProduct,setModalVisible)}
                  >
                    <img
                      src={`/productsImages/${product.image}`}
                      alt={product.name}
                      className="mx-auto h-20 w-20 object-cover "
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

        <aside className="w-1/2 mr-10 min-h-[30rem] -mt-32">
        <div className="flex justify-end space-x-4 mt-0 p-4">
          <button
            onClick={() => { handleValidateSaleClick(
            productsToSale,
            isPaid,
            paidAmount,
             setPaidAmount,
            setRemainingAmount,
            description,
            setSale,
            setProductsSale,
            setErrorMessage,
            setShowErrorPopup,
            moneyGiven,
            totalPrice
           );
          }}
          className="px-8 py-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
          disabled={productsToSale.length === 0}
          >
         Valider
         </button>
            <button
              onClick={() => setProductsToSale([])}
              className="px-8 py-3 bg-red-500 text-white font-bold rounded-md hover:bg-red-600"
            >
              Annuler
            </button>
          </div>

          <div className="flex justify-between p-4 bg-white shadow-md rounded-md mb-4">
            <span className="w-1/3 text-left font-bold text-2xl">Total</span>
            <span className="w-1/3 text-center text-2xl">{totalQuantity}</span>
            <span className="w-1/3 text-right text-2xl">{totalPrice} DA</span>
          </div>

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
                    onDelete={(id) => handleDelete(id,setProductsToSale,productsToSale)}
                    onQuantityChange={(id,newQuantity) => handleQuantityUpdate(id, newQuantity,setProductsToSale,productsToSale,setErrorMessage,setShowErrorPopup)}
                  />
                </li>
              ))}
            </ul>
          )}

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
                  type="text"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(parseFloat(e.target.value))}
                  className="mt-1 p-2 w-full border rounded-md"
                  min="0"
                />
              </div>
            )}
            <div className="mt-2">
              <label className="block text-lg font-semibold">Montant donné par le client:</label>
              <input
              type="number"
              value={moneyGiven}
              onChange={(e) => setMoneyGiven(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              min="0"
            placeholder="Entrez le montant donné"
           />
            </div>
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

        </aside>
      </div>
      {modalVisible && selectedProduct && (
        <QuantityModal
          product={selectedProduct}
          onClose={() => handleModalClose(setModalVisible,setSelectedProduct)}
          onAddToSale={(product,selectedQuantity) => handleAddToSale(product, selectedQuantity,productsToSale,setProductsToSale,setModalVisible,setSelectedProduct)}
          maxQuantity={selectedProduct.quantity}
        />
      )}
      <BarcodeScanner onBarcodeScanned={(barcode) => handleBarcodeScanned(barcode,handleAddToSale,setErrorMessage,setShowErrorPopup,productsToSale,setProductsToSale)} />
    </main>
  )
}

export default SalesContent
