import React from 'react'
import HomeSideBar from '../components/HomeSideBar'
import CategoriesContent from '../components/categoriesContent/CategoriesContent'
const CategoriesPage = () => {
  return (
    <div className="flex">
      <HomeSideBar />
      <CategoriesContent />
    </div>
  )
}
export default CategoriesPage
