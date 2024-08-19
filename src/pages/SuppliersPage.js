import React from 'react'
import HomeSideBar from '../components/HomeSideBar'
import SuppliersContent from '../components/suppliersContent/SuppliersContent'

const SuppliersPage = () => {
  return (
    <div className="flex">
      <HomeSideBar />
      <SuppliersContent />
    </div>
  )
}
export default SuppliersPage;
