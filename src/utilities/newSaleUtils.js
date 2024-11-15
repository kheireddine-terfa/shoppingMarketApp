
export const handleCategoryClick = (category,setSelectedCategory,setSelectedProducts,noBarCodeProducts) => {
    setSelectedCategory(category)
    const filteredProducts = noBarCodeProducts.filter(
      (product) => product.categoryId === category.id,
    )
    console.log(filteredProducts)
    setSelectedProducts(filteredProducts)
  }

  export  const handleProductClick = (product,setSelectedProduct,setModalVisible) => {
    setSelectedProduct(product)
    setModalVisible(true)
}

export   const handleModalClose = (setModalVisible,setSelectedProduct) => {
    setModalVisible(false)
    setSelectedProduct(null)
  }

 export const handleAddToSale = (product, selectedQuantity,productsToSale,setProductsToSale,setModalVisible,setSelectedProduct) => {
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

    handleModalClose(setModalVisible,setSelectedProduct)
  }

 export const handleDelete = (id,setProductsToSale,productsToSale) => {
    setProductsToSale(productsToSale.filter((product) => product.id !== id))
  }