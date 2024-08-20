import React from 'react'
import HomeSideBar from '../components/HomeSideBar'
import ProductsContent from '../components/ProductContent/ProductsContent'
const ProductsPage = () => {
  return (
    <div className="flex">
      <HomeSideBar />
      <ProductsContent />
    </div>
  )
}
export default ProductsPage
