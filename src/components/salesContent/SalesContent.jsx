import React, { useState, useMemo } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import SaledProduct from './SaledProduct';
import Category from './Category';
import QuantityModal from './QuantityModal';

const SalesContent = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Apple', price: 0.99, category: 'Fruits', quantity: 1000, hasBarCode: false, balanced_product: true },
    { id: 2, name: 'Orange', price: 1.29, category: 'Fruits', quantity: 500, hasBarCode: false, balanced_product: true },
    { id: 3, name: 'Banana', price: 1.09, category: 'Fruits', quantity: 2000, hasBarCode: false, balanced_product: true },
    { id: 11, name: 'Carrot', price: 0.89, category: 'Vegetables', quantity: 100, hasBarCode: false, balanced_product: false },
    { id: 12, name: 'Broccoli', price: 1.59, category: 'Vegetables', quantity: 150, hasBarCode: false, balanced_product: false },
    { id: 21, name: 'Almond', price: 3.49, category: 'Nuts', quantity: 300, hasBarCode: false, balanced_product: true },
    { id: 22, name: 'Walnut', price: 4.29, category: 'Nuts', quantity: 120, hasBarCode: false, balanced_product: true },
    { id: 31, name: 'Honey', price: 5.99, category: 'Others', quantity: 50, hasBarCode: false, balanced_product: false },
    { id: 32, name: 'Jam', price: 2.59, category: 'Others', quantity: 75, hasBarCode: false, balanced_product: false },
  ]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productsToSale, setProductsToSale] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedProducts(products.filter(product => product.category === category));
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const handleAddToSale = (product, selectedQuantity) => {
    const existingProduct = productsToSale.find(p => p.id === product.id);
    
    if (existingProduct) {
      setProductsToSale(productsToSale.map(p => 
        p.id === product.id ? { ...p, quantity: p.quantity + selectedQuantity } : p
      ));
    } else {
      setProductsToSale([...productsToSale, { ...product, quantity: selectedQuantity }]);
    }

    handleModalClose();
  };

  const handleQuantityUpdate = (id, newQuantity) => {
    setProductsToSale(productsToSale.map(product =>
      product.id === id ? { ...product, quantity: newQuantity } : product
    ));
  };

  const handleDelete = (id) => {
    setProductsToSale(productsToSale.filter(product => product.id !== id));
  };

  const totalQuantity = useMemo(() => {
    return productsToSale.reduce((sum, product) => sum + (product.balanced_product ? 1 : product.quantity), 0);
  }, [productsToSale]);

  const totalPrice = useMemo(() => {
    return productsToSale.reduce((sum, product) => {
      const productPrice = product.balanced_product ? product.price * (product.quantity / 1000) : product.price * product.quantity;
      return sum + productPrice;
    }, 0).toFixed(2);
  }, [productsToSale]);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl p-4 w-6/12">
        Articles sans code barre
      </h1>
      <div className="flex">
        <section className="w-1/2 p-4 mr-10">
          {selectedCategory === null ? (
            <div className="grid grid-cols-3 gap-5 gap-y-12">
              <Category title="Fruits" imageSrc={require("./image.jpeg")} onClick={() => handleCategoryClick('Fruits')} />
              <Category title="Légumes" imageSrc={require("./veg.jpeg")} onClick={() => handleCategoryClick('Vegetables')} />
              <Category title="Noisettes" imageSrc={require("./nois.jpeg")} onClick={() => handleCategoryClick('Nuts')} />
              <Category title="Autres" imageSrc={require("./oth.jpeg")} onClick={() => handleCategoryClick('Others')} />
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
                {selectedProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-zinc-100 text-center h-40"
                    onClick={() => handleProductClick(product)}
                  >
                    <img
                      src={require("./nois.jpeg")}
                      alt={product.name}
                      className="mx-auto h-full object-cover h-20"
                    />
                    <h3 className="mt-2 text-lg md:text-xl lg:text-2xl">{product.name}</h3>
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
              {productsToSale.map(product => (
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

          <div className="flex justify-end space-x-4 mt-4 p-4">
            <button
              onClick={() => alert("Validated!")}
              className="px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
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
    </main>
  );
};

export default SalesContent;
