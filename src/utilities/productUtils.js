export const checkForAlert = (expirationDates) => {
  if (!expirationDates[0]) return null

  const currentDate = new Date()
  const expDate = new Date(expirationDates[0].date)
  const alertDate = new Date(expDate)
  alertDate.setDate(alertDate.getDate() - expirationDates[0].alert_interval)

  return currentDate >= alertDate && currentDate < expDate
    ? 'Near Expiration !'
    : null
}
export const getInventoryState = (quantity, minQuantity) => {
  let inventoryState = ''
  let inventoryStateClass = ''

  if (quantity > minQuantity) {
    inventoryState = 'In Stock'
    inventoryStateClass = 'text-green-900 bg-green-200'
  } else if (quantity > 0 && quantity <= minQuantity) {
    inventoryState = 'Low Stock'
    inventoryStateClass = 'text-orange-900 bg-orange-200'
  } else if (quantity === 0) {
    inventoryState = 'Out of Stock'
    inventoryStateClass = 'text-red-900 bg-red-200'
  } else {
    return console.log('haaaaaa')
  }

  return { inventoryState, inventoryStateClass }
}
// Filter products searching :

export const filteredProducts = (products, searchQuery) => {
  return products.filter((product) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      (product.title && product.title.toLowerCase().includes(searchLower)) ||
      (product.inventoryState &&
        product.inventoryState.toLowerCase().includes(searchLower)) ||
      (product.price.toString() &&
        product.price.toString().toLowerCase().includes(searchLower))
    )
  })
}

export const modalData = (selectedProduct, categories) => {
  // Find the category name based on the categoryId
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : 'No Category'
  }
  return selectedProduct && selectedProduct.currentProduct
    ? [
        {
          label: 'Price',
          value: `${selectedProduct.currentProduct.price} DA`,
        },
        {
          label: 'Purchase Price',
          value: `${selectedProduct.currentProduct.purchase_price} DA`,
        },
        { label: 'Quantity', value: selectedProduct.currentProduct.quantity },
        {
          label: 'Min Quantity',
          value: selectedProduct.currentProduct.min_quantity,
        },
        {
          label: 'Inventory State',
          value: selectedProduct.inventoryState,
          className: selectedProduct.inventoryStateClass,
        },
        {
          label: 'Alert',
          value: selectedProduct.expAlert,
        },
        {
          label: 'Category',
          value: getCategoryName(
            selectedProduct.currentProduct.categoryId,
            categories,
          ),
        },
        {
          label: 'Has Barcode',
          value: selectedProduct.currentProduct.hasBarCode ? 'Yes' : 'No',
        },
        {
          label: 'Balanced Product',
          value: selectedProduct.currentProduct.balanced_product ? 'Yes' : 'No',
        },
        {
          label: 'Alert Interval',
          value: `${selectedProduct.alert_interval} days`,
        },
        {
          label: 'Expiration Dates',
          value: selectedProduct.currentProduct.ExpirationDates,
        },
      ]
    : []
}

export const initialFormData = {
  productName: '',
  productPrice: '',
  productPurchasePrice: '',
  productQuantity: '',
  minQuantity: '',
  barCode: '',
  productImage: null,
  isBalanced: false,
  hasBarCode: false,
  selectedCategory: '',
  expirationDate: '',
  alertInterval: '',
}
