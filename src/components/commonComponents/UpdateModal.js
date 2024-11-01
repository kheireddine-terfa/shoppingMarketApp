import React, { useState, useEffect } from 'react';
import FormInput from './FormInput';
import MyAlert from './Alert';
const UpdateModal = ({ title, InputsConfig, onSubmit, onCancel, supplyId }) => {
  const [productInputs, setProductInputs] = useState([
    { productName: '', productId: '', newProductId: '', quantity: '', purchasePrice: '', searchQuery: '', unit : '',expirationDate :'',alert_interval:'' },
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
        balanced: product.balanced_product,
      }));
      setProducts(productOptions);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

// Helper function to format the date as "yyyy-mm-dd"
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear();
  return `${year}-${month}-${day}`; // Format as "yyyy-mm-dd"
};


// Fetch Supply Products
const fetchSupplyProducts = async () => {
  try {
    // Fetch supply products
    const response = await fetch(`http://localhost:3001/api/supplies/${supplyId}/supply`);
    const productData = await response.json();

    // Fetch expiration dates
    const expirationResponse = await fetch(`http://localhost:3001/api/expiration-dates/supply/${supplyId}`);
    const expirationData = await expirationResponse.json();

    console.log(expirationData)

    // Join expiration dates with product data based on productId
    const fetchedProductInputs = productData.map((item) => {
      const expiration = expirationData.find(exp => exp.productId === item.productId) || {};

      // Format the expiration date as "jj-mm-aaaa"
      const formattedExpirationDate = expiration.date ? formatDate(expiration.date) : '';

      return {
        productName: item.name,
        productId: item.productId || '',
        newProductId: '', // Initialize newProductId as empty
        quantity: item.quantity || '',
        purchasePrice: item.purchase_price || '',
        searchQuery: '',
        balancedProduct: false,
        expirationDate: formattedExpirationDate, // Add formatted expiration date
        alert_interval: expiration.alert_interval || '', // Add alert interval if available
      };
    });

    // Set the combined data
    setProductInputs(fetchedProductInputs);
  } catch (error) {
    console.error('Error fetching supply products:', error);
  }
};

useEffect(() => {
  fetchSupplyProducts();
  fetchProducts(); // Assuming fetchProducts is used for a different purpose
}, []);

  console.log(productInputs)

  const addProductInput = () => {
    setProductInputs([
      ...productInputs,
      { productName: '', productId: '', newProductId: '', quantity: '', purchasePrice: '', searchQuery: '',expirationDate :'',alert_interval:''  },
    ]);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...productInputs];
    updatedProducts[index][field] = value;
  
    // If the field being updated is newProductId, also update productId
    if (field === 'newProductId') {
      updatedProducts[index].productId = value;

      if (field === 'newProductId') {
        const selectedProduct = products.find((product) => product.value === parseInt(value));
        console.log(selectedProduct)
        if(selectedProduct.balanced === false){
          updatedProducts[index].unit = "units"
        }else{
          updatedProducts[index].unit = "grams";
        }
      }
          // Handle expiration date validation
    if (field === 'expirationDate') {
      const today = getTodayDate();
      if (value < today) {
        updatedProducts[index].expirationDate = today; // Reset to today's date if the entered date is in the past
      }
    }
    }
  
    setProductInputs(updatedProducts);
  };

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
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

  const handleOnSubmit = (e) => {
    e.preventDefault();
  
    // Prepare the data for submission
    const updatedProductInputs = productInputs.map((product) => ({
      ...product,
      newProductId: product.newProductId || product.productId, // Use newProductId if set, otherwise use productId
      productId: product.productId || product.newProductId,
    }));
  
    onSubmit(updatedProductInputs);
    console.log(updatedProductInputs)
  }

  const firstColumnInputs =
    InputsConfig.length > 7 ? InputsConfig.slice(0, 7) : InputsConfig;
  const secondColumnInputs =
    InputsConfig.length > 7 ? InputsConfig.slice(7) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/4 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Update {title}</h2>
        <form onSubmit={handleOnSubmit}>
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

          {/* Product Inputs Section */}
          {title === "Update Supply" ? (
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
                      handleProductChange(index, 'newProductId', e.target.value)
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
                      <div className="flex items-center space-x-2 w-1/2">
                        <label className="text-sm font-medium">Exp date:</label>
                        <input
                          type="date"
                          placeholder="Exp date"
                          value={product.expirationDate}
                          onChange={(e) =>
                            handleProductChange(index, 'expirationDate', e.target.value)
                          }
                          className="border rounded p-2 w-full"
                        />
                      </div>

                      <div className="flex items-center space-x-2 w-1/2">
                        <label className="text-sm font-medium">Alert interval</label>
                        <input
                          type="number"
                          placeholder="Alert interval"
                          value={product.alert_interval}
                          onChange={(e) =>
                            handleProductChange(index, 'alert_interval', e.target.value)
                          }
                          className="border rounded p-2 w-full"
                          min={0}
                          onWheel={() => document.activeElement.blur()}
                        />
                      </div>
                    </div>
                  )}
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
          ) : null}

          <div className="flex justify-center space-x-4 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
