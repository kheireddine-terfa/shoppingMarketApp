

import axios from 'axios'

import { initialFormData } from '../utilities/productUtils'

export const fetchSuppliers = async (setSuppliers,  setErrorMessage,
    setShowErrorPopup) => {
    try {
      const response = await fetch('http://localhost:3001/api/suppliers')
      if (!response.ok) {
        setErrorMessage('Failed to fetch suppliers.')
        setShowErrorPopup(true)
        return
      }
      const data = await response.json()
      setSuppliers(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }


    // Fetch supplies from the backend
export const fetchSupplies = async (setSupplies,setLastSupplyId,  setErrorMessage,
    setShowErrorPopup,) => {
        try {
          const response = await fetch('http://localhost:3001/api/supplies');
          if (!response.ok) {
            setErrorMessage('Failed to fetch supplies.')
            setShowErrorPopup(true)
            return
          }
          const data = await response.json();
          // Map the data as before
          const mappedSupplies = data.map((supply) => {
            return {
              id: supply.id,
              amount: supply.amount,
              description: supply.description,
              paid_amount: supply.paid_amount,
              remaining_amount: supply.remaining_amount,
              titleHref: `/supplies/${supply.id}`,
              date: supply.date,
              currentSupply: supply,
            };
          });
    
          // Set the supplies state
          setSupplies(mappedSupplies);
    
          // Get the last supply ID
          if (data.length > 0) {
            const lastSupply = data[data.length - 1]; // Assuming the last element in data is the latest
            setLastSupplyId(lastSupply.id);
          }
        } catch (error) {
          console.error('Error fetching supplies:', error);
        }
      };

        // Handle delete
export  const handleConfirmDelete = async (selectedSupply,setSupplies,setSelectedSupply,setShowDeleteModal,supplies,setErrorMessage,
    setShowErrorPopup) => {
    if (!selectedSupply) return // Ensure selectedSupply is set
    try {
      const response = await fetch(
        `http://localhost:3001/api/supplies/${selectedSupply}`,
        {
          // Use template literal with backticks
          method: 'DELETE',
        },
      )
      if (response.ok) {
        // Remove the deleted supply from the state
        setSupplies(supplies.filter((s) => s.id !== selectedSupply))
        setSelectedSupply(null) // Reset selectedSupply after deletion
        setShowDeleteModal(false) // Close the delete modal
      } else {
        const errorData = await response.json() // Parse the error message
        setErrorMessage(errorData.message || 'Failed to delete the supply')
        setShowErrorPopup(true)
        return
            }
    } catch (error) {
      console.error('Error deleting supply:', error)
    }
  }
    // Handle delete all supplies
export  const handleDeleteAll = async (setSupplies,setLastSupplyId,setShowConfirmModal,setErrorMessage,
        setShowErrorPopup) => {
        try {
          const response = await fetch('http://localhost:3001/api/supplies', {
            method: 'DELETE',
          })
    
          if (response.ok) {
            fetchSupplies(setSupplies,setLastSupplyId,setErrorMessage,setShowErrorPopup,) // Re-fetch supplies after all are deleted
            setShowConfirmModal(false) // Close the modal
          } else {
            const errorData = await response.json() // Parse the error message
            setErrorMessage(errorData.message || 'Failed to delete the supply')
            setShowErrorPopup(true)
            return
          }
        } catch (error) {
          console.error('Error deleting all supplies:', error)
        }
    }

 export  const handleAddSupply = async (setFormData,setShowModal,setSupplies,newSupply,newSupplyProducts,setErrorMessage,
    setShowErrorPopup) => {
        try {
           const response = await fetch('http://localhost:3001/api/supplies', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newSupply), // Send the FormData
          })
    
          if (response.ok) {
    
            const supplyProducrsPromises = newSupplyProducts.map((nsp) => {
              return axios.post('http://localhost:3001/api/product-supplies', {
                quantity: parseInt(nsp.quantity),
                purchase_price : parseInt(nsp.purchase_price),
                productId: parseInt(nsp.productId),
                supplyId: parseInt(nsp.supplyId),
                expiration_date: nsp.expiration_date,
                alert_interval:parseInt(nsp.alert_interval)
              });
            });
            const addedSupply = await response.json()
            // Update the state with the new supply including its
            const updatedSupply = {
              id: addedSupply.id,
              titleHref: `/supplies/${addedSupply.id}`,
              date: addedSupply.date,
              amount: addedSupply.amount,
              description: addedSupply.description,
              paid_amount: addedSupply.paid_amount,
              remaining_amount: addedSupply.remaining_amount,
              supplierId : addedSupply.supplierId
            }
            setSupplies((prevSupplies) => [...prevSupplies, updatedSupply])
            fetchSupplies()
            setShowModal(false)
            // Reset form data after adding a supply
            setFormData(initialFormData)
          } else {
            const errorData = await response.json() // Parse the error message
            setErrorMessage(errorData.message || 'Failed to add the supply')
            setShowErrorPopup(true)
            return
          }
        } catch (error) {
          console.error('Error adding supply:', error)
        }
      }


 export  const handleUpdate = async (setSupplies,setLastSupplyId,setFormData,setShowUpdateModal,updatedSupply,UpdatedSupplyProducts,updatedexpirationDates,setErrorMessage,
    setShowErrorPopup) => {
        try {
          // Create a FormData object to handle the file upload and other data
          const formData = {
            date: updatedSupply.date,
            amount: updatedSupply.amount,
            description: updatedSupply.description,
            paid_amount: updatedSupply.paid_amount,
            remaining_amount: updatedSupply.remaining_amount,
            supplierId : updatedSupply.supplierId
          }
          // Send the updated data to the backend
          const response = await fetch(
            `http://localhost:3001/api/supplies/${updatedSupply.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            },
          )
    
          if (!response.ok) {
            const errorData = await response.json() // Parse the error message
            setErrorMessage(errorData.message || 'Failed to update the supply')
            setShowErrorPopup(true)
            return
          } else {
            const promises = UpdatedSupplyProducts.map((usp) => {
              return {
                quantity: parseInt(usp.quantity),
                purchase_price: parseInt(usp.purchase_price),
                productId: parseInt(usp.productId),
                supplyId: parseInt(usp.supplyId),
                newProductId: parseInt(usp.newProductId),
                expiration_date : usp.expirationDate,
                alert_interval : parseInt(usp.alert_interval)
              };
            });
            // Send the entire array in one request
            await axios.put(`http://localhost:3001/api/product-supplies/`, promises);
    
            const expDatesprodmises = updatedexpirationDates.map((ued) => {
              return{
                date : ued.expiration_date,
                alert_interval : parseInt(ued.alert_interval),
                productId : parseInt(ued.productId),
                supplyId : parseInt(ued.supplyId),
                newProductId:parseInt(ued.newProductId),
              }
            })
    
            await axios.put(`http://localhost:3001/api/expiration-dates`,expDatesprodmises)
            fetchSupplies(setSupplies,setLastSupplyId, setErrorMessage,setShowErrorPopup,)
            setShowUpdateModal(false)
            setFormData(initialFormData)
          }
        } catch (error) {
          console.error('Error updating supply:', error)
          // Handle the error, e.g., show an error message to the user
        }
      }

export  const handleUpdateSubmit = async (setSupplies,setLastSupplyId,setFormData,setShowUpdateModal,formData,selectedSupply,productInputs,setErrorMessage,
    setShowErrorPopup) => {
        const updatedSupply = {
          id: selectedSupply.id, // The ID of the supply being updated
          date: formData.date,
          amount: formData.amount,
          description: formData.description,
          paid_amount: formData.paid_amount,
          remaining_amount: formData.remaining_amount,
          supplierId : formData.supplierId
        }
    
        const UpdatedSupplyProducts = productInputs.map((product) => {
          return{
            supplyId :parseInt(selectedSupply.id),
            productId : parseInt(product.productId),
            purchase_price : parseInt(product.purchasePrice),
            quantity : parseInt(product.quantity),
            newProductId : parseInt(product.newProductId),
          }})
    
          const updatedexpirationDates = productInputs.map((product) => {
            const [expYear, expMonth, expDay] = product.expirationDate.split('-'); // Split the date string
            const formattedExpirationDate = `${expDay}/${expMonth}/${expYear}`; // Rearrange to "DD/MM/YYYY"
            return{
              supplyId :parseInt(selectedSupply.id),
              productId : parseInt(product.productId),
              expiration_date: formattedExpirationDate, // Use the formatted expiration date
              alert_interval: parseInt(product.alert_interval),
              newProdcutId : parseInt(product.newProductId),
            }})
        handleUpdate(setSupplies,setLastSupplyId,setFormData,setShowUpdateModal,updatedSupply,UpdatedSupplyProducts,updatedexpirationDates,setErrorMessage,
            setShowErrorPopup,updatedSupply,UpdatedSupplyProducts,updatedexpirationDates)
      }

export const handleUpdateSupply = async (
        setShowUpdateModal,
        setSelectedSupply,
        setFormData,
        supply,
        setErrorMessage,
        setShowErrorPopup,
        setSelectedSupplyProducts // Added this as the final parameter
      ) => {
        setSelectedSupply(supply);
        setFormData({
          date: supply.date,
          amount: supply.amount,
          description: supply.description,
          paid_amount: supply.paid_amount,
          remaining_amount: supply.remaining_amount,
          supplierId: supply.supplierId,
        });
        try {
          const response = await fetch(`http://localhost:3001/api/supplies/${supply.id}/supply`);
          if (!response.ok) {
            const errorData = await response.json(); // Parse the error message
            setErrorMessage(errorData.message || 'Failed to update the supply');
            setShowErrorPopup(true);
            return;
          }
          const data = await response.json();
          setSelectedSupplyProducts(data);
        } catch (error) {
          console.error('Error fetching supply products:', error);
        }
        setShowUpdateModal(true);
      };

      
export const handleShowDetails = async (setSelectedSupply,setShowDetailsModal,setSelectedSupplyProducts,setSelectedSupplier,supply,setErrorMessage,setShowErrorPopup) => {
    try {
      const response = await fetch(`http://localhost:3001/api/supplies/${supply.id}/supplier`)
      if(!response.ok){
        const errorData = await response.json() // Parse the error message
        setErrorMessage(errorData.message || 'Failed to update the supply')
        setShowErrorPopup(true)
        return
      }
      const data = await response.json()
      setSelectedSupplier(data.name)
    } catch (error) {
      console.error('Error fetching supplier:', error)
    }
    try {
      const response = await fetch(`http://localhost:3001/api/supplies/${supply.id}/supply`)
      if(!response.ok){
        const errorData = await response.json() // Parse the error message
        setErrorMessage(errorData.message || 'Failed to update the supply')
        setShowErrorPopup(true)
        return
      }
      const data = await response.json()
      setSelectedSupplyProducts(data)
    } catch (error) {
      console.error('Error fetching supply products:', error)
    }
    setShowDetailsModal(true) // Show the details modal
    setSelectedSupply(supply)
  }

 export const handleAddSubmit = (setErrorMessage,setFormData,setShowModal,setSupplies,lastSupplyId,formData,productInputs,setShowErrorPopup) => {

    const currentDate = new Date(); // This creates a new Date object with the current date and time.
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1.
    const year = currentDate.getFullYear();
    
    // Format the date as "yyyy-mm-dd"
    const formattedDate = `${year}-${month}-${day}`;
    
     const newSupply = {
      date: formattedDate,
      amount: formData.amount,
      description: formData.description,
      paid_amount: formData.paid_amount,
      remaining_amount: formData.remaining_amount,
      supplierId: formData.supplierId,
    };
    
    const newSupplyProducts = productInputs.map((nps) => {
      // Format expiration date from "YYYY/MM/DD" to "DD/MM/YYYY"
      const [expYear, expMonth, expDay] = nps.expirationDate.split('-'); // Split the date string
      const formattedExpirationDate = `${expDay}/${expMonth}/${expYear}`; // Rearrange to "DD/MM/YYYY"
  
      return {
        supplyId: lastSupplyId + 1,
        productId: nps.productId,
        purchase_price: nps.purchasePrice,
        quantity: nps.quantity,
        expiration_date: formattedExpirationDate, // Use the formatted expiration date
        alert_interval: nps.alert_interval
      };
    });

    console.log(newSupplyProducts)
      
    handleAddSupply(setFormData,setShowModal,setSupplies,newSupply,newSupplyProducts,setErrorMessage,
      setShowErrorPopup);
  };
    