import React, { useState, useEffect } from 'react';
import FormInput from '../../commonComponents/FormInput';

const AddModalWithProducts = ({ onSubmit, onCancel, InputsConfig, title, theme }) => {
  const [productInputs, setProductInputs] = useState([
    { productId: '', quantity: '', purchasePrice: '', searchQuery: '', unit: '' },
  ]);
  const [products, setProducts] = useState([]);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products');
      const data = await response.json();
      const productOptions = data.map((product) => ({
        value: product.id,
        label: product.name,
        balanced: product.balanced_product, // Include balanced status
      }));
      setProducts(productOptions);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProductInput = () => {
    setProductInputs([
      ...productInputs,
      { productId: '', quantity: '', purchasePrice: '', searchQuery: '', unit: '' },
    ]);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...productInputs];
    updatedProducts[index][field] = value;
    // If the productId is changing, update the unit based on balanced status
    if (field === 'productId') {
      const selectedProduct = products.find((product) => product.value === parseInt(value));
      console.log(selectedProduct)
      if(selectedProduct.balanced === false){
        updatedProducts[index].unit = "units"
      }else{
        updatedProducts[index].unit = "grams";
      }
    }
    setProductInputs(updatedProducts);
  };

  const handleSearchChange = (index, e) => {
    const query = e.target.value.toLowerCase();
    const updatedProducts = [...productInputs];
    updatedProducts[index].searchQuery = query;
    setProductInputs(updatedProducts);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = productInputs.filter((_, i) => i !== index);
    setProductInputs(updatedProducts);
  };

  const getFilteredProducts = (searchQuery) => {
    return products.filter((product) =>
      product.label.toLowerCase().includes(searchQuery)
    );
  };

  const handleAddToSupply = (e) => {
    e.preventDefault();
    onSubmit(productInputs);
  };

  const firstColumnInputs = InputsConfig.length > 7 ? InputsConfig.slice(0, 7) : InputsConfig;
  const secondColumnInputs = InputsConfig.length > 7 ? InputsConfig.slice(7) : [];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-black'} bg-opacity-50 overflow-y-auto`}>
      <div className={`bg-white p-6 rounded-lg shadow-lg w-2/4 max-h-screen overflow-y-auto`}>
        <h2 className="text-xl font-semibold mb-4">Add New {title}</h2>
        <form onSubmit={handleAddToSupply}>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {firstColumnInputs.map((inputConfig, index) => (
              <div key={`first-${index}`} className="col-span-1">
                <FormInput
                  label={inputConfig.label}
                  type={inputConfig.type || 'text'}
                  value={inputConfig.value}
                  checked={inputConfig.checked}
                  onChange={inputConfig.onChange}
                  options={inputConfig.options}
                  disabled={inputConfig.disabled}
                  required={inputConfig.required}
                  min={inputConfig.min}
                  accept={inputConfig.accept}
                  maxLength={inputConfig.maxLength}
                />
              </div>
            ))}
            {secondColumnInputs.length > 0 &&
              secondColumnInputs.map((inputConfig, index) => (
                <div key={`second-${index}`} className="col-span-1">
                  <FormInput
                    label={inputConfig.label}
                    type={inputConfig.type || 'text'}
                    value={inputConfig.value}
                    checked={inputConfig.checked}
                    onChange={inputConfig.onChange}
                    options={inputConfig.options}
                    disabled={inputConfig.disabled}
                    required={inputConfig.required}
                    min={inputConfig.min}
                    accept={inputConfig.accept}
                    maxLength={inputConfig.maxLength}
                  />
                </div>
              ))}
          </div>

          {/* Dynamic Product Inputs */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Products</h3>
            {productInputs.map((product, index) => (
              <div key={index} className="space-y-2 mb-4 border border-blue-500 p-4 rounded-lg">
                {/* Search Bar */}
                <input
                  type="text"
                  placeholder="Search Product..."
                  value={product.searchQuery}
                  onChange={(e) => handleSearchChange(index, e)}
                  className="border rounded p-2 w-full"
                />

                {/* Product Dropdown */}
                <select
                  value={product.productId}
                  onChange={(e) =>
                    handleProductChange(index, 'productId', e.target.value)
                  }
                  className="border rounded p-2 w-full"
                  required
                >
                  <option value="" disabled>
                    Select Product
                  </option>
                  {getFilteredProducts(product.searchQuery).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* Quantity and Unit */}
                <div className="flex space-x-4 items-center w-full">
                  <div className="flex items-center space-x-2 w-1/2">
                  <label className="text-sm font-medium">Quantity {product.unit}</label>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={product.quantity}
                      onChange={(e) =>
                        handleProductChange(index, 'quantity', e.target.value)
                      }
                      className="border rounded p-2 w-full"
                      min={0}
                      onWheel={() => document.activeElement.blur()}
                      required
                    />
                    <span className="ml-2">{product.unit || ''}</span>
                  </div>

                  <div className="flex items-center space-x-2 w-1/2">
                    <label className="text-sm font-medium">Purchase Price:</label>
                    <input
                      type="number"
                      placeholder="Purchase Price"
                      value={product.purchasePrice}
                      onChange={(e) =>
                        handleProductChange(index, 'purchasePrice', e.target.value)
                      }
                      className="border rounded p-2 w-full"
                      min={0}
                      onWheel={() => document.activeElement.blur()}
                      required
                    />
                  </div>
                </div>

                {productInputs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(index)}
                    className="text-red-500 mt-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addProductInput}
              className="mt-2 text-blue-500"
            >
              + Add Another Product
            </button>
          </div>

          <div className="flex justify-center space-x-4 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className={`px-4 py-2 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'} rounded-lg`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 ${theme === 'dark' ? 'bg-green-700 text-white' : 'bg-green-600 text-white'} rounded-lg`}
            >
              Add {title}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModalWithProducts;
