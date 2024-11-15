import React, { useState, useEffect } from 'react';
import FormInput from '../../commonComponents/FormInput';
import MyAlert from '../../commonComponents/Alert';

const AddModalWithProducts = ({ onSubmit, onCancel, InputsConfig, title, theme }) => {
  const [productInputs, setProductInputs] = useState([
    { productId: '', quantity: '', purchasePrice: '', searchQuery: '', unit: '', expirationDate: '', alert_interval: '', addExpirationDate: false },
  ]);
  const [products, setProducts] = useState([]);
  const [showAlert, setShowAlert] = useState(true); // State to control alert visibility

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products');
      const data = await response.json();
      const productOptions = data.map((product) => ({
        value: product.id,
        label: product.name,
        balanced: product.balanced_product,
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
    setProductInputs((prevInputs) => [
      ...prevInputs,
      { productId: '', quantity: '', purchasePrice: '', searchQuery: '', expirationDate: '', unit: '', alert_interval: '', addExpirationDate: false },
    ]);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...productInputs];
    updatedProducts[index][field] = value;

    if (field === 'productId') {
      const selectedProduct = products.find((product) => product.value === parseInt(value));
      updatedProducts[index].unit = selectedProduct?.balanced ? 'grams' : 'units';
    }

    // Handle expiration date validation
    if (field === 'expirationDate') {
      const today = getTodayDate();
      if (value < today) {
        updatedProducts[index].expirationDate = today; // Reset to today's date if the entered date is in the past
      }
    }

    setProductInputs(updatedProducts);
  };

  const handleCheckboxChange = (index) => {
    const updatedProducts = [...productInputs];
    updatedProducts[index].addExpirationDate = !updatedProducts[index].addExpirationDate;

    // Clear the expiration date and alert interval if the checkbox is unchecked
    if (!updatedProducts[index].addExpirationDate) {
      updatedProducts[index].expirationDate = '';
      updatedProducts[index].alert_interval = '';
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

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

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

          <MyAlert></MyAlert>

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

                <div className="flex flex-col space-y-4 w-full">
                  {/* First Row: Quantity and Purchase Price */}
                  <div className="flex space-x-4 w-full">
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

                  {/* Checkbox for Adding Expiration Date */}
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={product.addExpirationDate}
                        onChange={() => handleCheckboxChange(index)}
                        className="form-checkbox"
                      />
                      <span className="ml-2">Add an expiration date?</span>
                    </label>
                  </div>

                  {/* Second Row: Expiration Date and Alert Interval (conditionally rendered) */}
                  {product.addExpirationDate && (
                    <div className="flex space-x-4 w-full mt-2">
                      <div className="flex flex-col w-1/2">
                        <label className="text-sm font-medium">Expiration Date:</label>
                        <input
                          type="date"
                          value={product.expirationDate}
                          onChange={(e) =>
                            handleProductChange(index, 'expirationDate', e.target.value)
                          }
                          className="border rounded p-2"
                          required
                        />
                      </div>
                      <div className="flex flex-col w-1/2">
                        <label className="text-sm font-medium">Alert Interval (days):</label>
                        <input
                          type="number"
                          placeholder="Days before expiration to alert"
                          value={product.alert_interval}
                          onChange={(e) =>
                            handleProductChange(index, 'alert_interval', e.target.value)
                          }
                          className="border rounded p-2"
                          min={0}
                          onWheel={() => document.activeElement.blur()}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Remove Product Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(index)}
                  className="mt-2 text-red-600 hover:underline"
                >
                  Remove Product
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addProductInput}
              className="mt-4 text-blue-600 hover:underline"
            >
              Add Another Product
            </button>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="mr-4 text-gray-600 hover:underline"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Add to Supply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModalWithProducts;
