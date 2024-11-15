
import axios from 'axios'
import dayjs from 'dayjs';


export const fetchCategories = async (setCategories,setErrorMessage,setShowErrorPopup) => {
    try {
      const response = await axios.get('http://localhost:3001/api/categories') // Replace with your API
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories', error)
    }
  }

export const fetchNoBarCodeProducts = async (setNoBarCodeProducts,noBarCodeProducts,setErrorMessage,setShowErrorPopup) => {
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

export  const handleQuantityUpdate = async (id, newQuantity,setProductsToSale,productsToSale,setErrorMessage,setShowErrorPopup) => {
    const product = await axios.get(`http://localhost:3001/api/products/${id}`)
    const maxQuantity = product.data.product.quantity

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

  export const handleValidateSaleClick = async (
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
    totalPrice,
  ) => {
    try {
      // Calculate totalPrice
      const total = productsToSale
        .reduce((sum, product) => {
          const productPrice = product.balanced_product
            ? product.price * (product.quantity / 1000)
            : product.price * product.quantity;
          return sum + productPrice;
        }, 0)
        .toFixed(2);
  
      console.log('Total Price:', total);
  
      // Determine paidAmount and remainingAmount
      let updatedPaidAmount = 0;
      let updatedRemainingAmount = parseFloat(total);
  
      if (isPaid === true) {
        updatedPaidAmount = parseFloat(total);
        updatedRemainingAmount = 0;
      } else {
        updatedPaidAmount = parseFloat(paidAmount) || 0;
        updatedRemainingAmount = parseFloat(total) - updatedPaidAmount;
      }
  
      console.log('Updated Paid Amount:', updatedPaidAmount);
      console.log('Updated Remaining Amount:', updatedRemainingAmount);
  
      const change = moneyGiven ? (parseFloat(moneyGiven) - parseFloat(total)).toFixed(2) : 0;
  
      // Validate if the given money is sufficient
      if (moneyGiven && change < 0) {
        alert('Le montant donné est insuffisant pour couvrir le total.');
        return;
      }
  
      // Combine confirmation and money change alert
      const confirmSale = window.confirm(
        `${change > 0 ? `Monnaie à rendre au client: ${change} DA\n` : ''}Êtes-vous sûr de vouloir confirmer cette vente ?`
      );
  
      if (!confirmSale) {
        return; // Exit if the user cancels
      }
  
      // Update state
      setPaidAmount(updatedPaidAmount);
      setRemainingAmount(updatedRemainingAmount);
  
      const saleData = {
        date: dayjs().format('YYYY-MM-DD'),
        amount: parseFloat(total),
        paid_amount: updatedPaidAmount,
        remaining_amount: updatedRemainingAmount,
        description: description,
      };
  
      console.log('Sale Data:', saleData);
  
      // Create sale
      const saleResponse = await axios.post(
        'http://localhost:3001/api/sales',
        saleData
      );
      const createdSale = saleResponse.data;
      setSale(createdSale);
  
      // Create ProductSale entries
      const productSalePromises = productsToSale.map((product) => {
        return axios.post('http://localhost:3001/api/product-sales', {
          quantity: product.quantity,
          productId: product.id,
          saleId: createdSale.id,
        });
      });
  
      const productsSaleResponse = await Promise.all(productSalePromises);
      setProductsSale(productsSaleResponse.map((response) => response.data));
  
      console.log('Sale and ProductSales successfully created', {
        sale: createdSale,
        productsSale: productsSaleResponse,
      });
  
      // Reload the app after the sale is confirmed and processed
      window.location.reload();
      Window.location.focus()
    } catch (error) {
      console.error('Failed to validate sale', error);
      setErrorMessage('An error occurred while processing the sale.');
      setShowErrorPopup(true);
    }
  };
  

 export const handleBarcodeScanned = async (barcode,handleAddToSale,setErrorMessage,setShowErrorPopup,productsToSale,setProductsToSale) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/products/barcode/${barcode}`,
      )
      const product = response.data

      if (product) {
        handleAddToSale(product, 1,productsToSale,setProductsToSale) // Add the product with a default quantity of 1
      } else {
        alert('Product not found')
      }
    } catch (error) {
      console.error('Failed to fetch product by barcode', error)
    }
  }